import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4" style={{ background: 'var(--gradient-hero)' }}>
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Shield className="w-4 h-4 mr-1 inline" />
            Legal
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold mb-4">Introduction</h2>
            <p className="text-muted-foreground mb-8">
              At agent13 ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Information We Collect</h2>
            <h3 className="text-2xl font-semibold mb-3 mt-8">Personal Information</h3>
            <p className="text-muted-foreground mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-6 space-y-2">
              <li>Register for an account</li>
              <li>Subscribe to our services</li>
              <li>Contact us through our contact form</li>
              <li>Sign up for our newsletter</li>
            </ul>
            <p className="text-muted-foreground mb-8">
              This information may include your name, email address, phone number, and any other information you choose to provide.
            </p>

            <h3 className="text-2xl font-semibold mb-3 mt-8">Usage Data</h3>
            <p className="text-muted-foreground mb-8">
              We automatically collect certain information when you visit our website, including your IP address, browser type, operating system, access times, and the pages you have viewed.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>Provide, operate, and maintain our services</li>
              <li>Improve, personalize, and expand our services</li>
              <li>Understand and analyze how you use our services</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you for customer service, updates, and marketing purposes</li>
              <li>Process your transactions and send related information</li>
              <li>Prevent fraud and enhance security</li>
            </ul>

            <h2 className="text-3xl font-bold mb-4 mt-12">Data Security</h2>
            <p className="text-muted-foreground mb-8">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Third-Party Services</h2>
            <p className="text-muted-foreground mb-8">
              We may use third-party service providers to help us operate our business and administer activities on our behalf. These third parties may have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-8 space-y-2">
              <li>The right to access and receive a copy of your personal information</li>
              <li>The right to correct or update your personal information</li>
              <li>The right to delete your personal information</li>
              <li>The right to restrict or object to our processing of your personal information</li>
              <li>The right to data portability</li>
            </ul>

            <h2 className="text-3xl font-bold mb-4 mt-12">Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground mb-8">
              We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Children's Privacy</h2>
            <p className="text-muted-foreground mb-8">
              Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground mb-8">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>

            <h2 className="text-3xl font-bold mb-4 mt-12">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy, please contact us through our contact page or at:
            </p>
            <p className="text-muted-foreground">
              agent13 ai<br />
              Email: support@agent13ai.com
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
