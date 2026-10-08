package com.trustlens.model;

import java.sql.Timestamp;

public class OtpVerification {
    private int otpId;
    private String email;
    private String otpCode;
    private String purpose; // 'REGISTRATION', 'PASSWORD_RESET'
    private Timestamp expiresAt;
    private boolean used;

    public OtpVerification() {}

    public OtpVerification(String email, String otpCode, String purpose, Timestamp expiresAt) {
        this.email = email;
        this.otpCode = otpCode;
        this.purpose = purpose;
        this.expiresAt = expiresAt;
        this.used = false;
    }

    public int getOtpId() { return otpId; }
    public void setOtpId(int otpId) { this.otpId = otpId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public Timestamp getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Timestamp expiresAt) { this.expiresAt = expiresAt; }

    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }
}
