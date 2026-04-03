import { Link } from "react-router-dom";
import { Youtube, Facebook, Instagram } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="agent13 ai logo" 
                className="h-8 w-auto transition-transform group-hover:scale-110"
              />
              <span className="font-bold">agent13 ai</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-Powered Document Solutions for Law Firms
            </p>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground opacity-70">
                <Youtube className="w-4 h-4" />
                YouTube — Coming Soon
              </span>
              <a 
                href="https://www.facebook.com/people/Agent13-ai/61583475990300/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="w-4 h-4" />
                Follow on Facebook
              </a>
              <a 
                href="https://www.instagram.com/agent13_ai/?utm_source=ig_web_button_share_sheet" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
                Follow on Instagram
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/ai-tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  AI Tools
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} agent13 ai. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 max-w-2xl mx-auto">
            Disclaimer: The information on this website is for general informational purposes only and does not constitute legal advice. While we strive for accuracy, we make no guarantees about the completeness or reliability of any content. agent13 ai reserves the right to modify any content at any time without notice. See our{" "}
            <Link to="/terms" className="underline hover:text-primary transition-colors">Terms of Service</Link> for full details.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
