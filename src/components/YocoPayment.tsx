import React, { useState, useEffect } from 'react';
import { yocoConfig } from '../lib/yoco-config';
import { upgradeUserPlanWithYoco } from '../lib/subscriptions';
import { useAuth } from '../contexts/AuthContext';

// TypeScript declarations for Yoco SDK
declare global {
  interface Window {
    YocoSDK: any;
  }
}

interface YocoPaymentProps {
  planType: 'pro' | 'premium' | 'ultra';
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

interface YocoSDKInstance {
  showPopup: (config: YocoPopupConfig) => Promise<YocoPopupResult>;
}

interface YocoPopupResult {
  checkoutId?: string;
  checkoutContainerId?: string;
  checkoutContainer?: any;
  configuration?: any;
  initialize?: () => void;
  mountCheckoutContainer?: (e?: boolean) => void;
  showPopup?: () => void;
}

interface YocoPopupConfig {
  amountInCents: number;
  currency: string;
  name: string;
  description: string;
  callback: (result: YocoResult) => void;
}

interface YocoResult {
  error?: {
    message: string;
    type: string;
  };
  id?: string;
  status?: string;
}

export const YocoPayment: React.FC<YocoPaymentProps> = ({
  planType,
  onSuccess,
  onError,
  className = '',
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [yocoSDK, setYocoSDK] = useState<YocoSDKInstance | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize Yoco SDK when component mounts
    const initializeYoco = () => {
      console.log('🔵 Initializing Yoco SDK...');
      
      if (window.YocoSDK) {
        try {
          console.log('✅ Yoco SDK found, creating instance with key:', yocoConfig.publicKey);
          const sdk = new window.YocoSDK({
            publicKey: yocoConfig.publicKey
          });
          setYocoSDK(sdk);
          console.log('✅ Yoco SDK initialized successfully');
        } catch (error) {
          console.error('❌ Failed to initialize Yoco SDK:', error);
          onError('Payment system initialization failed');
        }
      } else {
        console.log('⏳ Yoco SDK not loaded yet, retrying in 1 second...');
        // Retry after a short delay if SDK not loaded yet
        setTimeout(initializeYoco, 1000);
      }
    };

    initializeYoco();
  }, [onError]);

  const amount = yocoConfig.planPricing[planType];
  const displayAmount = (amount / 100).toFixed(2);

  const handlePayment = async () => {
    console.log('🔵 Payment button clicked - Starting payment flow');
    
    // Authentication check - must be logged in
    if (!user) {
      console.log('❌ User not authenticated');
      onError('You must be logged in to make a payment. Please sign in first.');
      return;
    }

    console.log('✅ User authenticated:', user.uid || user.id);

    // SDK check
    if (!yocoSDK) {
      console.log('❌ Yoco SDK not ready');
      onError('Payment system not ready. Please try again in a moment.');
      return;
    }

    console.log('✅ Yoco SDK ready');
    
    // Check for popup blocker
    const testPopup = window.open('', '_blank', 'width=1,height=1');
    if (!testPopup || testPopup.closed) {
      console.log('❌ Popup blocker detected');
      onError('Please disable popup blocker for this site and try again. Payment forms require popups to work.');
      return;
    }
    testPopup.close();
    console.log('✅ Popup blocker test passed');
    
    setIsLoading(true);

    try {
      console.log('🔵 Showing Yoco popup with config:', {
        amountInCents: amount,
        currency: yocoConfig.currency,
        planType
      });

      // Set a timeout to catch if the popup never appears
      let timeoutCleared = false;
      const timeoutId = setTimeout(() => {
        if (!timeoutCleared) {
          console.log('⏰ Yoco popup timeout - no response after 2 minutes');
          onError('Payment form took too long to load. Please check if popups are blocked and try again.');
          setIsLoading(false);
        }
      }, 120000); // Increased to 2 minutes

      const popupConfig = {
        amountInCents: amount,
        currency: yocoConfig.currency,
        name: 'CompanAI',
        description: `${planType.toUpperCase()} Plan Subscription - AI Development Accelerator`,
        callback: async (result: YocoResult) => {
          console.log('🔵 Yoco callback received:', result);
          timeoutCleared = true;
          clearTimeout(timeoutId);
          
          try {
            if (result.error) {
              console.log('❌ Payment error from Yoco:', result.error);
              onError(result.error.message || 'Payment failed');
              setIsLoading(false);
              return;
            }

            if (result.id) {
              console.log('✅ Payment token received:', result.id);
              // Process the payment on the backend
              await processPayment(result.id, amount, planType);
            } else {
              console.log('❌ No payment token received');
              onError('Payment token not received');
              setIsLoading(false);
            }
          } catch (error: any) {
            console.error('❌ Payment callback error:', error);
            onError(error.message || 'Payment processing failed');
            setIsLoading(false);
          }
        }
      };

      console.log('🔵 Calling yocoSDK.showPopup with config:', popupConfig);
      
      const result = await yocoSDK.showPopup(popupConfig);
      console.log('🔵 showPopup returned:', result);
      
      // Check if popup appeared
      if (result && result.checkoutId) {
        console.log('✅ Yoco popup created with ID:', result.checkoutId);
        console.log('🔵 Waiting for user to complete payment...');
        
        // The popup is created but callback might not work due to iframe issues
        // Let's wait a bit and then check if payment form is visible
        setTimeout(() => {
          const yocoContainer = document.getElementById(result.checkoutContainerId);
          if (yocoContainer) {
            console.log('✅ Yoco payment form is visible in DOM');
          } else {
            console.log('❌ Yoco payment form not found in DOM');
          }
        }, 2000);
      }
      
    } catch (error: any) {
      console.error('❌ Payment popup error:', error);
      onError(error.message || 'Failed to open payment form');
      setIsLoading(false);
    }
  };

  const processPayment = async (token: string, amount: number, planType: string) => {
    console.log('🔵 Processing payment with token:', token);
    
    try {
      // Double-check authentication
      if (!user) {
        console.log('❌ User not authenticated in processPayment');
        throw new Error('User not authenticated');
      }

      const userId = user.uid || user.id;
      console.log('✅ Processing payment for user:', userId);

      // Since we don't have a backend yet, we'll simulate the payment processing
      // and use the subscription service to upgrade the user
      
      // In a real implementation, you would send this to your backend:
      // const response = await fetch('/api/payments/process-yoco', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${authToken}`
      //   },
      //   body: JSON.stringify({ token, amount, planType, currency: 'ZAR' })
      // });

      console.log('🔵 Upgrading user plan with Yoco data');
      
      // Use the subscription service to handle the upgrade
      await upgradeUserPlanWithYoco(
        userId,
        planType as 'pro' | 'premium' | 'ultra',
        {
          paymentId: token,
          amount: amount,
          currency: 'ZAR'
        }
      );

      console.log('✅ Payment processed successfully');

      onSuccess({
        paymentId: token,
        planType,
        amount,
        message: `Successfully upgraded to ${planType.toUpperCase()} plan!`
      });

    } catch (error: any) {
      console.error('❌ Payment processing error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('not authenticated')) {
        onError('Authentication required. Please sign in and try again.');
      } else if (error.message?.includes('indexOf')) {
        onError('Data formatting error. Please try again or contact support.');
      } else {
        onError(`Payment processing failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      console.log('🔵 Setting loading to false');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isLoading || !yocoSDK || !user}
      className={`
        w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 
        text-white font-semibold py-3 px-6 rounded-lg 
        transition-all duration-200 transform hover:scale-105
        disabled:hover:scale-100 disabled:cursor-not-allowed
        flex items-center justify-center space-x-2
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Processing...</span>
        </>
      ) : !yocoSDK ? (
        <span>Loading payment system...</span>
      ) : !user ? (
        <span>Please log in to upgrade</span>
      ) : (
        <>
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
            />
          </svg>
          <span>Pay R{displayAmount} with Yoco</span>
        </>
      )}
    </button>
  );
};

export default YocoPayment; 