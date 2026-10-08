package com.trustlens.servlet;

import com.google.gson.JsonObject;
import com.trustlens.dao.OtpDAO;
import com.trustlens.dao.UserDAO;
import com.trustlens.dao.impl.OtpDAOImpl;
import com.trustlens.dao.impl.UserDAOImpl;
import com.trustlens.model.OtpVerification;
import com.trustlens.model.User;
import com.trustlens.util.EmailUtil;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.util.Random;

@WebServlet(urlPatterns = {"/api/send-otp", "/api/resend-otp", "/api/verify-otp", "/api/forgot-password", "/api/reset-password"})
public class OtpServlet extends HttpServlet {

    private OtpDAO otpDAO;
    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        this.otpDAO = new OtpDAOImpl();
        this.userDAO = new UserDAOImpl();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        JsonObject jsonResponse = new JsonObject();

        String servletPath = req.getServletPath();

        if ("/api/send-otp".equals(servletPath) || "/api/resend-otp".equals(servletPath)) {
            handleSendOrResendOtp(req, jsonResponse);
        } else if ("/api/verify-otp".equals(servletPath)) {
            handleVerifyOtp(req, jsonResponse);
        } else if ("/api/forgot-password".equals(servletPath)) {
            handleForgotPassword(req, jsonResponse);
        } else if ("/api/reset-password".equals(servletPath)) {
            handleResetPassword(req, jsonResponse);
        }

        out.print(jsonResponse.toString());
    }

    private void handleSendOrResendOtp(HttpServletRequest req, JsonObject jsonResponse) {
        String email = req.getParameter("email");
        String purpose = req.getParameter("purpose");
        if (purpose == null || purpose.trim().isEmpty()) {
            purpose = "REGISTRATION";
        }

        if (email == null || !email.contains("@")) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Please enter a valid email address");
            return;
        }

        generateAndSendOtp(email, purpose, jsonResponse);
    }

    private void handleVerifyOtp(HttpServletRequest req, JsonObject jsonResponse) {
        String email = req.getParameter("email");
        String otpCode = req.getParameter("otp");
        String purpose = req.getParameter("purpose");
        if (purpose == null || purpose.trim().isEmpty()) {
            purpose = "REGISTRATION";
        }

        boolean isValid = otpDAO.verifyOtp(email, otpCode, purpose);
        if (isValid) {
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "OTP verified successfully");
        } else {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Invalid or expired OTP. Please try again.");
        }
    }

    private void handleForgotPassword(HttpServletRequest req, JsonObject jsonResponse) {
        String email = req.getParameter("email");
        if (email == null || !email.contains("@")) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Please enter a valid email address");
            return;
        }

        User user = userDAO.getUserByEmail(email);
        if (user == null) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "No account found with this email address");
            return;
        }

        generateAndSendOtp(email, "PASSWORD_RESET", jsonResponse);
    }

    private void handleResetPassword(HttpServletRequest req, JsonObject jsonResponse) {
        String email = req.getParameter("email");
        String otpCode = req.getParameter("otp");
        String newPassword = req.getParameter("newPassword");

        if (email == null || otpCode == null || newPassword == null || newPassword.length() < 6) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Password must be at least 6 characters");
            return;
        }

        boolean isValidOtp = otpDAO.verifyOtp(email, otpCode, "PASSWORD_RESET");
        if (!isValidOtp) {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Invalid or expired OTP code");
            return;
        }

        boolean updated = userDAO.updatePassword(email, newPassword);
        if (updated) {
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "Password reset successfully. You can now login with your new password.");
        } else {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Failed to update password. Please try again.");
        }
    }

    private void generateAndSendOtp(String email, String purpose, JsonObject jsonResponse) {
        // Generate 6-digit random OTP
        String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);
        Timestamp expiresAt = new Timestamp(System.currentTimeMillis() + (10 * 60 * 1000)); // 10 mins

        OtpVerification otpObj = new OtpVerification(email, otpCode, purpose, expiresAt);
        boolean saved = otpDAO.saveOtp(otpObj);

        if (saved) {
            boolean emailSent = EmailUtil.sendOtpEmail(email, otpCode);
            jsonResponse.addProperty("success", true);
            jsonResponse.addProperty("message", "OTP sent successfully to " + email);
        } else {
            jsonResponse.addProperty("success", false);
            jsonResponse.addProperty("message", "Failed to process OTP request. Please try again.");
        }
    }
}
