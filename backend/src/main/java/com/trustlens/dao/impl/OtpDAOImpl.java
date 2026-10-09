package com.trustlens.dao.impl;

import com.trustlens.config.DBConnection;
import com.trustlens.dao.OtpDAO;
import com.trustlens.model.OtpVerification;

import java.sql.*;

public class OtpDAOImpl implements OtpDAO {

    @Override
    public boolean saveOtp(OtpVerification otp) {
        String sql = "INSERT INTO otp_verifications (email, otp_code, purpose, expires_at) VALUES (?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, otp.getEmail().trim());
            ps.setString(2, otp.getOtpCode().trim());
            ps.setString(3, otp.getPurpose());
            ps.setTimestamp(4, otp.getExpiresAt());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean verifyOtp(String email, String otpCode, String purpose) {
        if (email == null || otpCode == null) return false;

        String cleanEmail = email.trim();
        String cleanOtp = otpCode.trim();

        String sql = "SELECT otp_id, expires_at FROM otp_verifications WHERE LOWER(TRIM(email)) = LOWER(?) AND TRIM(otp_code) = ? AND purpose = ? AND is_used = false ORDER BY otp_id DESC LIMIT 1";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, cleanEmail);
            ps.setString(2, cleanOtp);
            ps.setString(3, purpose);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Timestamp expiresAt = rs.getTimestamp("expires_at");
                    // Compare epoch time to avoid timezone mismatch
                    if (expiresAt != null && expiresAt.getTime() > System.currentTimeMillis()) {
                        return markOtpAsUsed(cleanEmail, cleanOtp);
                    } else {
                        System.err.println("OTP Code expired. Expire: " + expiresAt + ", Current: " + new Timestamp(System.currentTimeMillis()));
                    }
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean markOtpAsUsed(String email, String otpCode) {
        String sql = "UPDATE otp_verifications SET is_used = true WHERE LOWER(TRIM(email)) = LOWER(?) AND TRIM(otp_code) = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email.trim());
            ps.setString(2, otpCode.trim());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
