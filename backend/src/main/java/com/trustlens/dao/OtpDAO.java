package com.trustlens.dao;

import com.trustlens.model.OtpVerification;

public interface OtpDAO {
    boolean saveOtp(OtpVerification otp);
    boolean verifyOtp(String email, String otpCode, String purpose);
    boolean markOtpAsUsed(String email, String otpCode);
}
