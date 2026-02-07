import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 animated-gradient-bg">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <FileText className="w-4 h-4 mr-1 inline" />
            Legal
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground mb-8">
              By accessing or using agent13 ai services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Use License</h2>
            <p className="text-muted-foreground mb-4">
              Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>Access and use our services for your personal or commercial purposes</li>
              <li>Use the AI tools and features provided as part of our service</li>
              <li>Download and use any software or documentation we provide</li>
            </ul>

            <h2 className="text-3xl font-bold mb-4 mt-12">User Accounts</h2>
            <p className="text-muted-foreground mb-4">
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring your account information is accurate and up-to-date</li>
            </ul>

            <h2 className="text-3xl font-bold mb-4 mt-12">Acceptable Use</h2>
            <p className="text-muted-foreground mb-4">
              You agree not to use our services to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others, including intellectual property rights</li>
              <li>Transmit malicious code, viruses, or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt our services</li>
              <li>Use our services for any illegal or unauthorized purpose</li>
              <li>Harass, abuse, or harm other users</li>
            </ul>

            <h2 className="text-3xl font-bold mb-4 mt-12">Intellectual Property</h2>
            <p className="text-muted-foreground mb-8">
              The service and its original content, features, and functionality are owned by agent13 ai and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of our services without our express written permission.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">AI-Generated Content</h2>
            <p className="text-muted-foreground mb-8">
              Our AI tools generate content based on your inputs. While we strive for accuracy, we do not guarantee that AI-generated content will be error-free, complete, or suitable for your specific purposes. You are responsible for reviewing and verifying all AI-generated content before use.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Payment and Billing</h2>
            <p className="text-muted-foreground mb-4">
              If you purchase any services from us:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>You agree to pay all fees associated with your subscription or purchase</li>
              <li>Prices are subject to change with notice</li>
              <li>All payments are non-refundable unless otherwise stated</li>
              <li>You authorize us to charge your payment method for all fees incurred</li>
            </ul>

            <h2 className="text-3xl font-bold mb-4 mt-12">Termination</h2>
            <p className="text-muted-foreground mb-8">
              We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the services will immediately cease.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Disclaimer of Warranties</h2>
            <p className="text-muted-foreground mb-8">
              Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the services will be uninterrupted, secure, or error-free, or that any defects will be corrected.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Limitation of Liability</h2>
            <p className="text-muted-foreground mb-8">
              To the maximum extent permitted by law, agent13 ai shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Indemnification</h2>
            <p className="text-muted-foreground mb-8">
              You agree to indemnify, defend, and hold harmless agent13 ai, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from your use of our services or violation of these Terms.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Governing Law</h2>
            <p className="text-muted-foreground mb-8">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which agent13 ai operates, without regard to its conflict of law provisions.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Changes to Terms</h2>
            <p className="text-muted-foreground mb-8">
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the services after any changes constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us through our contact page or at:
            </p>
            <p className="text-muted-foreground">
              agent13 ai<br />
              Email: RoyBernales@agent13.ai
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;
