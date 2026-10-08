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

            ps.setString(1, otp.getEmail());
            ps.setString(2, otp.getOtpCode());
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
        String sql = "SELECT * FROM otp_verifications WHERE email = ? AND otp_code = ? AND purpose = ? AND is_used = false AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            ps.setString(2, otpCode);
            ps.setString(3, purpose);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return markOtpAsUsed(email, otpCode);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean markOtpAsUsed(String email, String otpCode) {
        String sql = "UPDATE otp_verifications SET is_used = true WHERE email = ? AND otp_code = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            ps.setString(2, otpCode);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
