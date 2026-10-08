package com.trustlens.util;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailUtil {

    // Configure your SMTP credentials via Environment Variables or defaults
    private static final String SMTP_HOST = System.getenv("SMTP_HOST") != null ? System.getenv("SMTP_HOST") : "smtp.gmail.com";
    private static final String SMTP_PORT = System.getenv("SMTP_PORT") != null ? System.getenv("SMTP_PORT") : "587";
    private static final String SMTP_USER = System.getenv("SMTP_USER") != null ? System.getenv("SMTP_USER") : "shoryaprataprathore28@gmail.com";
    private static final String SMTP_PASS = System.getenv("SMTP_PASS") != null ? System.getenv("SMTP_PASS") : "jmbteuwgkitqdeab";

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
            message.setSubject("TrustLens - OTP Verification Code");

            String htmlContent = "<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 8px;'>"
                    + "<h2 style='color: #3b82f6;'>TrustLens Account Verification</h2>"
                    + "<p>Your One-Time Password (OTP) for account registration is:</p>"
                    + "<h1 style='color: #22c55e; letter-spacing: 4px; font-size: 36px;'>" + otpCode + "</h1>"
                    + "<p>This code will expire in <strong>10 minutes</strong>. Please do not share this OTP with anyone.</p>"
                    + "<hr style='border: 1px solid #334155;'/>"
                    + "<p style='font-size: 12px; color: #94a3b8;'>TrustLens Emergency Shelter Management System</p>"
                    + "</div>";

            message.setContent(htmlContent, "text/html; charset=utf-8");

            // In local development, if SMTP is not configured, print to console as fallback
            if ("your-email@gmail.com".equals(SMTP_USER)) {
                System.out.println("=================================================");
                System.out.println("[LOCAL DEV OTP SIMULATION] Sent to: " + recipientEmail);
                System.out.println("[LOCAL DEV OTP CODE]: " + otpCode);
                System.out.println("=================================================");
                return true;
            }

            Transport.send(message);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Failed to send OTP email: " + e.getMessage());
            return false;
        }
    }
}
