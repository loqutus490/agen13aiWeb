import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DownloadConfirmationRequest {
  firstName: string;
  lastName: string;
  email: string;
  resourceTitle: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send download confirmation function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, resourceTitle }: DownloadConfirmationRequest = 
      await req.json();

    console.log(`Sending confirmation email to ${email} for ${resourceTitle}`);

    const emailResponse = await resend.emails.send({
      from: "Agent13 AI <onboarding@resend.dev>",
      to: [email],
      subject: `Your ${resourceTitle} is Ready!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
              }
              .content {
                padding: 40px 30px;
              }
              .content h2 {
                color: #667eea;
                margin-top: 0;
                font-size: 22px;
              }
              .content p {
                margin: 16px 0;
                color: #555;
              }
              .resource-box {
                background: #f8f9fa;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 24px 0;
                border-radius: 4px;
              }
              .resource-box strong {
                color: #667eea;
                font-size: 18px;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                margin: 20px 0;
                transition: transform 0.2s;
              }
              .footer {
                background: #f8f9fa;
                padding: 30px;
                text-align: center;
                color: #777;
                font-size: 14px;
                border-top: 1px solid #eee;
              }
              .footer a {
                color: #667eea;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You, ${firstName}! 🎉</h1>
              </div>
              <div class="content">
                <h2>Your Download is Complete</h2>
                <p>Hi ${firstName} ${lastName},</p>
                <p>
                  Thank you for downloading our resource! We're excited to help you on your AI journey.
                </p>
                
                <div class="resource-box">
                  <strong>${resourceTitle}</strong>
                </div>

                <p>
                  This resource is designed to provide you with practical insights and actionable steps 
                  to implement AI solutions in your business. If you have any questions or need assistance, 
                  don't hesitate to reach out.
                </p>

                <p style="text-align: center;">
                  <a href="https://agent13ai.com/contact" class="cta-button">
                    Get in Touch
                  </a>
                </p>

                <p>
                  <strong>What's Next?</strong><br>
                  • Review the resource at your own pace<br>
                  • Identify opportunities for AI in your business<br>
                  • Schedule a consultation to discuss your specific needs<br>
                  • Explore more resources on our website
                </p>

                <p>
                  We're here to support you every step of the way as you transform your business with AI.
                </p>

                <p>
                  Best regards,<br>
                  <strong>The Agent13 AI Team</strong>
                </p>
              </div>
              <div class="footer">
                <p>
                  <a href="https://agent13ai.com">Visit Our Website</a> • 
                  <a href="https://agent13ai.com/resources">More Resources</a> • 
                  <a href="https://agent13ai.com/contact">Contact Us</a>
                </p>
                <p>
                  Agent13 AI - Transforming Small Businesses with AI Solutions
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-download-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
