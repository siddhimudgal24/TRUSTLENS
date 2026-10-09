package com.trustlens.util;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailUtil {

    private static final String SMTP_HOST = DotenvUtil.get("SMTP_HOST", "smtp.gmail.com");
    private static final String SMTP_PORT = DotenvUtil.get("SMTP_PORT", "587");
    private static final String SMTP_USER = DotenvUtil.get("SMTP_USER", "your-email@gmail.com");
    private static final String SMTP_PASS = DotenvUtil.get("SMTP_PASS", "your-app-password");

    public static boolean sendOtpEmail(String recipientEmail, String otpCode) {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SMTP_USER, SMTP_PASS);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(SMTP_USER, "TrustLens Security"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail));
            message.setSubject("🔒 TrustLens Verification Code: " + otpCode);

            String htmlContent = "<!DOCTYPE html>"
                    + "<html>"
                    + "<head><meta charset='UTF-8'></head>"
                    + "<body style='margin: 0; padding: 0; background-color: #080E1A; font-family: \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color: #F8FAFC;'>"
                    + "  <table width='100%' border='0' cellspacing='0' cellpadding='0' style='background-color: #080E1A; padding: 40px 10px;'>"
                    + "    <tr>"
                    + "      <td align='center'>"
                    + "        <table width='100%' max-width='560' border='0' cellspacing='0' cellpadding='0' style='max-width: 560px; background-color: #0B1220; border: 1px solid #1E293B; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);'>"
                    + "          <!-- Header Banner -->"
                    + "          <tr>"
                    + "            <td style='background: linear-gradient(135deg, #1E293B 0%, #0F172A 100%); padding: 32px 32px 24px 32px; border-bottom: 1px solid #1E293B; text-align: center;'>"
                    + "              <div style='display: inline-block; background-color: rgba(59, 130, 246, 0.15); border: 1px solid rgba(59, 130, 246, 0.3); padding: 8px 16px; border-radius: 20px; color: #3B82F6; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; mb-2;'>"
                    + "                Emergency Operations Platform"
                    + "              </div>"
                    + "              <h1 style='margin: 16px 0 0 0; color: #FFFFFF; font-size: 26px; font-weight: 700; tracking-wide;'>TrustLens</h1>"
                    + "            </td>"
                    + "          </tr>"
                    + "          <!-- Body Content -->"
                    + "          <tr>"
                    + "            <td style='padding: 32px;'>"
                    + "              <h2 style='margin: 0 0 12px 0; color: #F8FAFC; font-size: 18px; font-weight: 600;'>Authentication Verification</h2>"
                    + "              <p style='margin: 0 0 24px 0; color: #94A3B8; font-size: 14px; line-height: 1.6;'>"
                    + "                You requested a One-Time Password (OTP) to complete your account security verification on <strong>TrustLens</strong>."
                    + "              </p>"
                    + "              <!-- OTP Code Display Box -->"
                    + "              <div style='background-color: #131C2E; border: 1px dashed #3B82F6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;'>"
                    + "                <span style='display: block; color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-bottom: 8px;'>Your 6-Digit OTP Code</span>"
                    + "                <div style='font-family: \"Courier New\", Courier, monospace; color: #22C55E; font-size: 38px; font-weight: 800; letter-spacing: 10px; margin: 0; text-shadow: 0 0 10px rgba(34, 197, 94, 0.2);'>"
                    + "                  " + otpCode
                    + "                </div>"
                    + "                <span style='display: block; color: #94A3B8; font-size: 12px; margin-top: 10px;'>"
                    + "                  ⏳ Expires in <strong>10 minutes</strong>"
                    + "                </span>"
                    + "              </div>"
                    + "              <!-- Security Note -->"
                    + "              <div style='background-color: rgba(239, 68, 68, 0.1); border-left: 3px solid #EF4444; border-radius: 4px; padding: 12px 16px; margin-bottom: 24px;'>"
                    + "                <p style='margin: 0; color: #FCA5A5; font-size: 12px; line-height: 1.5;'>"
                    + "                  <strong>Security Reminder:</strong> Never share this code with anyone. TrustLens personnel will never ask for your verification code."
                    + "                </p>"
                    + "              </div>"
                    + "            </td>"
                    + "          </tr>"
                    + "          <!-- Footer -->"
                    + "          <tr>"
                    + "            <td style='background-color: #080E1A; padding: 24px 32px; border-top: 1px solid #1E293B; text-align: center;'>"
                    + "              <p style='margin: 0 0 6px 0; color: #64748B; font-size: 12px;'>"
                    + "                TrustLens System — AI-Powered Shelter Readiness & Dynamic Allocation"
                    + "              </p>"
                    + "              <p style='margin: 0; color: #475569; font-size: 11px;'>"
                    + "                This is an automated operational alert. Please do not reply to this email."
                    + "              </p>"
                    + "            </td>"
                    + "          </tr>"
                    + "        </table>"
                    + "      </td>"
                    + "    </tr>"
                    + "  </table>"
                    + "</body>"
                    + "</html>";

            message.setContent(htmlContent, "text/html; charset=utf-8");
            Transport.send(message);
            System.out.println("✅ Real OTP email sent successfully to: " + recipientEmail);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Failed to send OTP email: " + e.getMessage());
            return false;
        }
    }
}
