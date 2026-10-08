<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TrustLens | Register</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .card-custom { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; }
    </style>
</head>
<body class="d-flex min-vh-100 align-items-center justify-content-center py-5">
<div class="container" style="max-width: 480px;">
    <div class="card card-custom p-4 shadow">
        <h3 class="text-center text-white mb-2">Create Account</h3>
        <p class="text-secondary text-center small mb-4">Module 1 - Role Registration</p>

        <form action="register" method="post">
            <div class="mb-3">
                <label class="form-label text-secondary small">Full Name</label>
                <input type="text" name="fullName" class="form-control bg-dark text-white border-secondary" required placeholder="John Doe">
            </div>
            <div class="mb-3">
                <label class="form-label text-secondary small">Username</label>
                <input type="text" name="username" class="form-control bg-dark text-white border-secondary" required placeholder="johndoe">
            </div>
            <div class="mb-3">
                <label class="form-label text-secondary small">Email Address</label>
                <input type="email" name="email" class="form-control bg-dark text-white border-secondary" required placeholder="john@example.com">
            </div>
            <div class="mb-3">
                <label class="form-label text-secondary small">Phone Number</label>
                <input type="text" name="phone" class="form-control bg-dark text-white border-secondary" placeholder="+1234567890">
            </div>
            <div class="mb-3">
                <label class="form-label text-secondary small">Role</label>
                <select name="roleId" class="form-select bg-dark text-white border-secondary">
                    <option value="4">Field Officer</option>
                    <option value="3">Shelter Manager</option>
                    <option value="2">Disaster Manager</option>
                    <option value="1">System Administrator</option>
                </select>
            </div>
            <div class="mb-4">
                <label class="form-label text-secondary small">Password</label>
                <input type="password" name="password" class="form-control bg-dark text-white border-secondary" required placeholder="••••••••">
            </div>
            <button type="submit" class="btn btn-primary w-100 py-2">Create Account</button>
        </form>

        <div class="mt-3 text-center small">
            <span class="text-secondary">Already registered?</span> <a href="login.jsp" class="text-info text-decoration-none">Sign In</a>
        </div>
    </div>
</div>
</body>
</html>
