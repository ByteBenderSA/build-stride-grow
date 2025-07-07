import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, FileText, Users, Globe } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Terms and Conditions
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-ZA', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Terms Content */}
      <div className="container mx-auto px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              
              {/* 1. Introduction */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <Shield className="w-6 h-6 text-purple-600" />
                  1. Introduction and Acceptance
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Welcome to CompanAI ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of our AI Development Accelerator platform, website, and services (collectively, the "Service"), operated by CompanAI, a company registered in South Africa.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms constitute a legally binding agreement between you and CompanAI. Please read them carefully before using our Service.
                  </p>
                </div>
              </section>

              {/* 2. Service Description */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-purple-600" />
                  2. Service Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    CompanAI provides an AI-powered development accelerator platform that helps users transform app ideas into working code. Our Service includes:
                  </p>
                  <ul className="text-gray-700 leading-relaxed mb-4 list-disc list-inside space-y-2">
                    <li>AI-powered app idea generation and enhancement</li>
                    <li>AI assistant for development guidance and support</li>
                    <li>Professional prompts for AI development tools</li>
                    <li>Project templates and development workflows</li>
                    <li>Educational resources and tutorials</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    Our Service is designed to accelerate the development process but does not guarantee specific outcomes or results. The quality of output depends on various factors including input quality and external AI tool capabilities.
                  </p>
                </div>
              </section>

              {/* 3. User Accounts */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                  <Users className="w-6 h-6 text-purple-600" />
                  3. User Accounts and Eligibility
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To use our Service, you must create an account. You agree to:
                  </p>
                  <ul className="text-gray-700 leading-relaxed mb-4 list-disc list-inside space-y-2">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Be at least 18 years old or have parental consent</li>
                    <li>Use the Service only for lawful purposes</li>
                    <li>Not share your account with others</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    You are responsible for all activities that occur under your account. We reserve the right to suspend or terminate accounts that violate these Terms.
                  </p>
                </div>
              </section>

              {/* 4. Pricing and Payment */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">4. Pricing and Payment Terms</h2>
                <div className="prose prose-gray max-w-none">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">4.1 Subscription Plans</h3>
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <ul className="text-gray-700 leading-relaxed space-y-2">
                      <li><strong>Free Plan:</strong> 1 AI-generated idea + 5 assistant interactions per month</li>
                      <li><strong>Pro Plan:</strong> R100 one-time payment for 5 ideas + 50 assistant interactions</li>
                      <li><strong>Ultra Plan:</strong> R100 per month for unlimited ideas and interactions</li>
                    </ul>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">4.2 Payment Processing</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Payments are processed through our secure payment partner, Paddle. By making a payment, you agree to Paddle's terms of service and privacy policy.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">4.3 Billing and Cancellation</h3>
                  <ul className="text-gray-700 leading-relaxed mb-4 list-disc list-inside space-y-2">
                    <li>Ultra plan subscriptions are billed monthly</li>
                    <li>Pro plan is a one-time payment with no recurring fees</li>
                    <li>You may cancel your Ultra subscription at any time</li>
                    <li>Cancellation takes effect at the end of the current billing period</li>
                    <li>No refunds for partial months unless required by law</li>
                  </ul>
                </div>
              </section>

              {/* 5. Usage Limits and Fair Use */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">5. Usage Limits and Fair Use</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    To ensure fair access for all users, we implement usage limits based on your subscription plan. You agree to:
                  </p>
                  <ul className="text-gray-700 leading-relaxed mb-4 list-disc list-inside space-y-2">
                    <li>Not exceed your plan's allocated usage limits</li>
                    <li>Not abuse or attempt to circumvent usage restrictions</li>
                    <li>Use the Service reasonably and in good faith</li>
                    <li>Not use automated systems to generate excessive requests</li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to throttle or suspend access for users who violate fair use policies.
                  </p>
                </div>
              </section>

              {/* 6. Intellectual Property */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">6. Intellectual Property Rights</h2>
                <div className="prose prose-gray max-w-none">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">6.1 Your Content</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You retain ownership of your ideas, prompts, and content submitted to our Service. By using our Service, you grant us a limited license to process your content to provide the Service.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">6.2 AI-Generated Content</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Content generated by our AI systems is provided to you for your use. However, you acknowledge that:
                  </p>
                  <ul className="text-gray-700 leading-relaxed mb-4 list-disc list-inside space-y-2">
                    <li>AI-generated content may not be eligible for copyright protection</li>
                    <li>Similar content may be generated for other users</li>
                    <li>You are responsible for verifying the originality of generated content</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">6.3 Our Platform</h3>
                  <p className="text-gray-700 leading-relaxed">
                    CompanAI owns all rights to the platform, including software, algorithms, designs, and proprietary methods. You may not copy, modify, or reverse engineer our platform.
                  </p>
                </div>
              </section>

              {/* 7. Privacy and Data Protection */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">7. Privacy and Data Protection</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We are committed to protecting your privacy and comply with South African data protection laws, including the Protection of Personal Information Act (POPIA). Our data practices are detailed in our Privacy Policy.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    By using our Service, you consent to the collection, use, and processing of your data as described in our Privacy Policy.
                  </p>
                </div>
              </section>

              {/* 8. Prohibited Uses */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">8. Prohibited Uses</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    You may not use our Service for:
                  </p>
                  <ul className="text-gray-700 leading-relaxed mb-4 list-disc list-inside space-y-2">
                    <li>Illegal activities or content that violates laws</li>
                    <li>Generating harmful, discriminatory, or offensive content</li>
                    <li>Spamming or unsolicited marketing</li>
                    <li>Attempting to gain unauthorized access to our systems</li>
                    <li>Competing directly with our Service using our technology</li>
                    <li>Violating intellectual property rights of others</li>
                  </ul>
                </div>
              </section>

              {/* 9. Disclaimers and Limitation of Liability */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">9. Disclaimers and Limitation of Liability</h2>
                <div className="prose prose-gray max-w-none">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">9.1 Service Availability</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We strive to maintain high availability but cannot guarantee uninterrupted service. We reserve the right to modify or discontinue features with reasonable notice.
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">9.2 AI Limitations</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Our AI systems are tools that assist in development but are not perfect. We do not guarantee:
                  </p>
                  <ul className="text-gray-700 leading-relaxed mb-4 list-disc list-inside space-y-2">
                    <li>Accuracy of AI-generated content</li>
                    <li>Functionality of suggested code</li>
                    <li>Commercial viability of generated ideas</li>
                    <li>Absence of errors or bugs</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">9.3 Limitation of Liability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To the maximum extent permitted by South African law, CompanAI's liability is limited to the amount you paid for the Service in the 12 months preceding the claim.
                  </p>
                </div>
              </section>

              {/* 10. Termination */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">10. Termination</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Either party may terminate this agreement at any time. We may suspend or terminate your account for violations of these Terms. Upon termination:
                  </p>
                  <ul className="text-gray-700 leading-relaxed mb-4 list-disc list-inside space-y-2">
                    <li>Your access to the Service will be discontinued</li>
                    <li>We may delete your account and data after reasonable notice</li>
                    <li>Outstanding payments remain due</li>
                    <li>Applicable provisions of these Terms survive termination</li>
                  </ul>
                </div>
              </section>

              {/* 11. Governing Law */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">11. Governing Law and Jurisdiction</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These Terms are governed by the laws of South Africa. Any disputes will be resolved in the courts of South Africa, and you consent to the exclusive jurisdiction of these courts.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We encourage resolving disputes through good faith negotiation before pursuing legal action.
                  </p>
                </div>
              </section>

              {/* 12. Changes to Terms */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">12. Changes to Terms</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated effective date. Continued use of the Service after changes constitutes acceptance of the new Terms.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    For material changes, we will provide at least 30 days' notice via email or platform notification.
                  </p>
                </div>
              </section>

              {/* 13. Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">13. Contact Information</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    If you have questions about these Terms, please contact us:
                  </p>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 leading-relaxed mb-2">
                      <strong>Email:</strong> tshilidzisibara4@gmail.com
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-2">
                      <strong>Company:</strong> CompanAI
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      <strong>Country:</strong> South Africa
                    </p>
                  </div>
                </div>
              </section>

              {/* Acceptance */}
              <section className="border-t pt-8">
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    By using CompanAI, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/dashboard">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg shadow-lg">
                        Accept and Continue
                      </Button>
                    </Link>
                    <Link to="/">
                      <Button variant="outline" className="px-8 py-3 rounded-lg">
                        Return to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms; 