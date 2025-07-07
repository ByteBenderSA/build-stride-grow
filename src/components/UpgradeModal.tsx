import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { YocoPayment } from './YocoPayment';
import { 
  Check, 
  X, 
  Crown, 
  Rocket, 
  Star,
  Zap
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onUpgradeSuccess: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onUpgradeSuccess
}) => {
  const { user } = useAuth();
  const [paymentSuccess, setPaymentSuccess] = useState<string>('');
  const [paymentError, setPaymentError] = useState<string>('');

  console.log('🔵 UpgradeModal rendered with isOpen:', isOpen);
  console.log('🔵 UpgradeModal currentPlan:', currentPlan);
  console.log('🔵 UpgradeModal user:', user);

  // Force show if isOpen is true
  useEffect(() => {
    console.log('🔵 UpgradeModal useEffect - isOpen changed to:', isOpen);
  }, [isOpen]);

  const plans = [
    {
      name: 'Pro',
      price: 'R70',
      period: 'one-time',
      description: 'Great for getting started',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      features: [
        '5 AI-generated app ideas',
        '50 AI assistant interactions',
        'Advanced project templates',
        'Priority email support',
        'Export to multiple formats',
        'Development roadmaps'
      ],
      unavailable: [],
      popular: true
    },
    {
      name: 'Premium',
      price: 'R100',
      period: 'one-time',
      description: 'Perfect for serious developers',
      icon: <Star className="w-6 h-6" />,
      color: 'from-orange-500 to-orange-600',
      features: [
        '20 AI-generated app ideas',
        '100 AI assistant interactions',
        'Premium project templates',
        'Priority email support',
        'Export to multiple formats',
        'Custom branding options',
        'Development roadmaps',
        'Advanced analytics'
      ],
      unavailable: [],
      popular: false
    },
    {
      name: 'Ultra',
      price: 'R100',
      period: 'per month',
      description: 'For agencies and power users',
      icon: <Rocket className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600',
      features: [
        'Unlimited AI-generated ideas',
        'Unlimited AI assistant interactions',
        'Premium project templates',
        'Direct WhatsApp/Email support',
        'Custom integrations',
        'Advanced analytics',
        'API access',
        'White-label options',
        '1-on-1 consultation calls'
      ],
      unavailable: [],
      popular: false
    }
  ];

  const handlePaymentSuccess = (paymentData: any) => {
    setPaymentSuccess(paymentData.message);
    setTimeout(() => {
      setPaymentSuccess('');
      onUpgradeSuccess();
      onClose();
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setTimeout(() => setPaymentError(''), 5000);
  };

  if (!user) return null;

  // Temporary simple version for testing
  if (isOpen) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={onClose}
      >
        <div 
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '500px',
            margin: '1rem'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2 style={{ margin: '0 0 1rem 0', color: 'black' }}>✅ UpgradeModal Works!</h2>
          <p style={{ color: 'black' }}>Current Plan: {currentPlan}</p>
          <p style={{ color: 'black' }}>User: {user?.email || 'No email'}</p>
          <button 
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Close & Test Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default UpgradeModal; 