<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TrustLens | Forgot Password</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .card-custom { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; }
    </style>
</head>
<body class="d-flex min-vh-100 align-items-center justify-content-center py-5">
<div class="container" style="max-width: 440px;">
    <div class="card card-custom p-4 shadow">
        <h3 class="text-center text-white mb-2">Reset Password</h3>
        <p class="text-secondary text-center small mb-4">Module 1 - Account Recovery</p>

        <div id="alertBox" class="alert d-none py-2 small" role="alert"></div>

        <!-- Step 1: Request OTP -->
        <form id="forgotForm">
            <div class="mb-3">
                <label class="form-label text-secondary small">Registered Email Address</label>
                <input type="email" id="emailInput" class="form-control bg-dark text-white border-secondary" required placeholder="name@example.com">
            </div>
            <button type="submit" id="sendOtpBtn" class="btn btn-primary w-100 py-2">Send Reset OTP</button>
        </form>

        <!-- Step 2: Verify OTP & Enter New Password -->
        <form id="resetForm" class="d-none mt-3">
            <div class="mb-3">
                <label class="form-label text-secondary small">Enter 6-digit OTP</label>
                <input type="text" id="otpInput" class="form-control bg-dark text-white border-secondary" maxlength="6" required placeholder="123456">
            </div>
            <div class="mb-3">
                <label class="form-label text-secondary small">New Password</label>
                <input type="password" id="newPassInput" class="form-control bg-dark text-white border-secondary" minlength="6" required placeholder="••••••••">
            </div>
            <button type="submit" id="resetBtn" class="btn btn-success w-100 py-2">Update Password</button>
            <button type="button" id="resendBtn" class="btn btn-link text-info text-decoration-none w-100 mt-2 btn-sm">Resend OTP</button>
        </form>

        <div class="mt-4 text-center small">
            <a href="login.jsp" class="text-secondary text-decoration-none"><i class="bi bi-arrow-left"></i> Back to Sign In</a>
        </div>
    </div>
</div>

<script>
    const forgotForm = document.getElementById('forgotForm');
    const resetForm = document.getElementById('resetForm');
    const alertBox = document.getElementById('alertBox');
    const emailInput = document.getElementById('emailInput');

    function showAlert(msg, isSuccess) {
        alertBox.className = `alert ${isSuccess ? 'alert-success' : 'alert-danger'} py-2 small`;
        alertBox.innerText = msg;
        alertBox.classList.remove('d-none');
    }

    forgotForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const res = await fetch(`api/forgot-password?email=${encodeURIComponent(email)}`, { method: 'POST' });
        const data = await res.json();
        
        showAlert(data.message, data.success);
        if (data.success) {
            forgotForm.classList.add('d-none');
            resetForm.classList.remove('d-none');
        }
    });

    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const otp = document.getElementById('otpInput').value;
        const newPassword = document.getElementById('newPassInput').value;

        const res = await fetch(`api/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}&newPassword=${encodeURIComponent(newPassword)}`, { method: 'POST' });
        const data = await res.json();
        
        showAlert(data.message, data.success);
        if (data.success) {
            setTimeout(() => window.location.href = 'login.jsp', 2000);
        }
    });

    document.getElementById('resendBtn').addEventListener('click', async () => {
        const email = emailInput.value;
        const res = await fetch(`api/resend-otp?email=${encodeURIComponent(email)}&purpose=PASSWORD_RESET`, { method: 'POST' });
        const data = await res.json();
        showAlert(data.message, data.success);
    });
</script>
</body>
</html>
