<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TrustLens | Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .card-custom { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; }
    </style>
</head>
<body class="d-flex min-vh-100 align-items-center justify-content-center">
<div class="container" style="max-width: 420px;">
    <div class="card card-custom p-4 shadow">
        <h3 class="text-center text-white mb-3">TrustLens Login</h3>
        <p class="text-secondary text-center small mb-4">Module 1 - User Authentication</p>
        
        <% if (request.getParameter("error") != null) { %>
            <div class="alert alert-danger py-2 small" role="alert">
                Invalid credentials or session expired.
            </div>
        <% } %>

        <form action="login" method="post">
            <div class="mb-3">
                <label class="form-label text-secondary small">Username or Email</label>
                <input type="text" name="username" class="form-control bg-dark text-white border-secondary" required placeholder="admin">
            </div>
            <div class="d-flex justify-content-between align-items-center mb-4">
                <label class="form-label text-secondary small mb-0">Password</label>
                <a href="forgot_password.jsp" class="text-info text-decoration-none small">Forgot password?</a>
            </div>
            <input type="password" name="password" class="form-control bg-dark text-white border-secondary mb-4" required placeholder="••••••••">
            <button type="submit" class="btn btn-primary w-100 py-2">Sign In</button>
        </form>
        
        <div class="mt-3 text-center small">
            <span class="text-secondary">Don't have an account?</span> <a href="register.jsp" class="text-info text-decoration-none">Register</a>
        </div>
    </div>
</div>
</body>
</html>
