package com.trustlens.util;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Properties;

public class EmailUtil {

    private static final String BREVO_API_KEY = DotenvUtil.get("BREVO_API_KEY", null);
    private static final String BREVO_SENDER = DotenvUtil.get("BREVO_SENDER", "shoryaprataprathore28@gmail.com");
    private static final String RESEND_API_KEY = DotenvUtil.get("RESEND_API_KEY", null);
    private static final String SMTP_HOST = DotenvUtil.get("SMTP_HOST", "smtp.gmail.com");
    private static final String SMTP_PORT = DotenvUtil.get("SMTP_PORT", "465");
    private static final String SMTP_USER = DotenvUtil.get("SMTP_USER", null);
    private static final String SMTP_PASS = DotenvUtil.get("SMTP_PASS", null);

    public static boolean sendOtpEmail(String recipientEmail, String otpCode) {
        String htmlContent = buildEmailTemplate(otpCode);

        // 1. Primary Method: Brevo HTTPS API (Port 443 - Sends to ANY recipient without domain restriction)
        if (BREVO_API_KEY != null && !BREVO_API_KEY.trim().isEmpty()) {
            boolean brevoSuccess = sendViaBrevo(recipientEmail, otpCode, htmlContent);
            if (brevoSuccess) {
                return true;
            }
            System.out.println("Notice: Brevo attempt did not succeed, trying next available provider...");
        }

        // 2. Secondary Method: Resend HTTPS API (Port 443)
        if (RESEND_API_KEY != null && RESEND_API_KEY.startsWith("re_")) {
            boolean resendSuccess = sendViaResend(recipientEmail, otpCode, htmlContent);
            if (resendSuccess) {
                return true;
            }
            System.out.println("Notice: Resend API attempt did not succeed, falling back to direct SMTP...");
        }

        // 3. Fallback Method: Direct JavaMail SMTP (Works on localhost or environments where SMTP is open)
        return sendViaSmtp(recipientEmail, otpCode, htmlContent);
    }

    private static boolean sendViaBrevo(String recipientEmail, String otpCode, String htmlContent) {
        try {
            JsonObject payload = new JsonObject();
            JsonObject sender = new JsonObject();
            sender.addProperty("name", "TrustLens Security");
            sender.addProperty("email", BREVO_SENDER);
            payload.add("sender", sender);

            JsonArray toList = new JsonArray();
            JsonObject toRecipient = new JsonObject();
            toRecipient.addProperty("email", recipientEmail.trim());
            toList.add(toRecipient);
            payload.add("to", toList);

            payload.addProperty("subject", "🔒 TrustLens Verification Code: " + otpCode);
            payload.addProperty("htmlContent", htmlContent);

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("api-key", BREVO_API_KEY.trim())
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload.toString(), StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                System.out.println("✅ Real OTP email delivered via Brevo API to: " + recipientEmail + " [HTTP " + response.statusCode() + "]");
                return true;
            } else {
                System.err.println("❌ Brevo API response [" + response.statusCode() + "]: " + response.body());
            }
        } catch (Exception e) {
            System.err.println("❌ Brevo API exception: " + e.getMessage());
        }
        return false;
    }

    private static boolean sendViaResend(String recipientEmail, String otpCode, String htmlContent) {
        try {
            JsonObject payload = new JsonObject();
            payload.addProperty("from", "TrustLens Security <onboarding@resend.dev>");
            JsonArray toList = new JsonArray();
            toList.add(recipientEmail.trim());
            payload.add("to", toList);
            payload.addProperty("subject", "🔒 TrustLens Verification Code: " + otpCode);
            payload.addProperty("html", htmlContent);

            HttpClient client = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + RESEND_API_KEY.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload.toString(), StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                System.out.println("✅ Real OTP email sent successfully via Resend API to: " + recipientEmail + " [HTTP " + response.statusCode() + "]");
                return true;
            } else {
                System.err.println("❌ Resend API response [" + response.statusCode() + "]: " + response.body());
            }
        } catch (Exception e) {
            System.err.println("❌ Resend API exception: " + e.getMessage());
        }
        return false;
    }

    private static boolean sendViaSmtp(String recipientEmail, String otpCode, String htmlContent) {
        if (SMTP_USER == null || SMTP_PASS == null) {
            return false;
        }

        Properties props = new Properties();
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);
        props.put("mail.smtp.auth", "true");
        if ("465".equals(SMTP_PORT)) {
            props.put("mail.smtp.ssl.enable", "true");
            props.put("mail.smtp.socketFactory.port", "465");
            props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
            props.put("mail.smtp.socketFactory.fallback", "false");
        } else {
            props.put("mail.smtp.starttls.enable", "true");
        }
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        props.put("mail.smtp.connectiontimeout", "6000");
        props.put("mail.smtp.timeout", "6000");

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
            message.setContent(htmlContent, "text/html; charset=utf-8");
            Transport.send(message);
            System.out.println("✅ Real OTP email sent successfully via SMTP to: " + recipientEmail);
            return true;
        } catch (Exception e) {
            System.err.println("❌ Failed to send OTP email via SMTP: " + e.getMessage());
            return false;
        }
    }

    private static String buildEmailTemplate(String otpCode) {
        return "<!DOCTYPE html>"
                + "<html>"
                + "<head><meta charset='UTF-8'></head>"
                + "<body style='margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color: #0F172A;'>"
                + "  <table width='100%' border='0' cellspacing='0' cellpadding='0' style='background-color: #F1F5F9; padding: 48px 16px;'>"
                + "    <tr>"
                + "      <td align='center'>"
                + "        <table width='100%' border='0' cellspacing='0' cellpadding='0' style='max-width: 540px; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);'>"
                + "          <tr>"
                + "            <td style='padding: 36px 36px 24px 36px; text-align: center; border-bottom: 1px solid #F1F5F9;'>"
                + "              <img src='https://trustlens-system.vercel.app/logo.jpeg' alt='TrustLens' width='68' height='68' style='display: block; margin: 0 auto 16px auto; border-radius: 18px; border: 1px solid #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.06);' />"
                + "              <div style='display: inline-block; background-color: #EFF6FF; border: 1px solid #DBEAFE; padding: 6px 14px; border-radius: 9999px; color: #2563EB; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;'>"
                + "                Emergency Operations Platform"
                + "              </div>"
                + "              <h1 style='margin: 8px 0 0 0; color: #0F172A; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;'>TrustLens</h1>"
                + "              <p style='margin: 4px 0 0 0; color: #64748B; font-size: 13px;'>Account Security & Role Verification</p>"
                + "            </td>"
                + "          </tr>"
                + "          <tr>"
                + "            <td style='padding: 36px 36px 28px 36px;'>"
                + "              <h2 style='margin: 0 0 12px 0; color: #0F172A; font-size: 18px; font-weight: 700;'>Authentication Verification Code</h2>"
                + "              <p style='margin: 0 0 24px 0; color: #475569; font-size: 14px; line-height: 1.6;'>"
                + "                Please use the one-time verification code below to authenticate your account and access the <strong>TrustLens Command Center</strong>."
                + "              </p>"
                + "              <div style='background-color: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 16px; padding: 28px 20px; text-align: center; margin-bottom: 24px;'>"
                + "                <span style='display: block; color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; margin-bottom: 10px;'>Your 6-Digit OTP Code</span>"
                + "                <div style='font-family: \"Courier New\", Courier, monospace; color: #1D4ED8; font-size: 40px; font-weight: 800; letter-spacing: 12px; margin: 0; padding-left: 12px;'>"
                + "                  " + otpCode
                + "                </div>"
                + "                <span style='display: block; color: #64748B; font-size: 12px; font-weight: 500; margin-top: 12px;'>"
                + "                  ⏱ Valid for <strong>10 minutes</strong> · Do not share"
                + "                </span>"
                + "              </div>"
                + "              <div style='background-color: #FEF2F2; border-left: 4px solid #EF4444; border-radius: 8px; padding: 14px 16px; margin-bottom: 8px;'>"
                + "                <p style='margin: 0; color: #991B1B; font-size: 12px; line-height: 1.5;'>"
                + "                  <strong>Security Notice:</strong> Never share this code with anyone. TrustLens emergency response staff will never ask for your verification code."
                + "                </p>"
                + "              </div>"
                + "            </td>"
                + "          </tr>"
                + "          <tr>"
                + "            <td style='background-color: #F8FAFC; padding: 24px 36px; border-top: 1px solid #E2E8F0; text-align: center;'>"
                + "              <p style='margin: 0 0 4px 0; color: #475569; font-size: 12px; font-weight: 600;'>"
                + "                TrustLens System — AI-Powered Shelter Readiness & Dynamic Allocation"
                + "              </p>"
                + "              <p style='margin: 0; color: #94A3B8; font-size: 11px;'>"
                + "                This is an automated operational security dispatch. Please do not reply."
                + "              </p>"
                + "            </td>"
                + "          </tr>"
                + "        </table>"
                + "      </td>"
                + "    </tr>"
                + "  </table>"
                + "</body>"
                + "</html>";
    }
}
