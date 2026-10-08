<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TrustLens | Emergency Shelter Readiness & Dynamic Allocation</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .hero-card { background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border-radius: 16px; }
        .module-badge { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    </style>
</head>
<body class="d-flex flex-column min-vh-100 justify-content-center align-items-center">

<div class="container py-5">
    <div class="row justify-content-center text-center">
        <div class="col-lg-8">
            <div class="hero-card p-5 shadow-lg">
                <div class="mb-4">
                    <span class="badge module-badge fs-6 px-3 py-2 rounded-pill mb-3">TrustLens PBL Project</span>
                    <h1 class="fw-bold display-5 text-white">Emergency Shelter Readiness & Dynamic Allocation</h1>
                    <p class="text-secondary lead mt-3">Java + Servlet/JSP + MySQL + JDBC + Bootstrap + Tomcat 9</p>
                </div>

                <div class="row g-3 my-4 text-start">
                    <div class="col-md-6">
                        <div class="p-3 border rounded bg-dark border-secondary">
                            <h6 class="text-primary"><i class="bi bi-shield-lock me-2"></i>Module 1</h6>
                            <p class="small text-muted mb-0">User Authentication & Role Management</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-3 border rounded bg-dark border-secondary">
                            <h6 class="text-warning"><i class="bi bi-exclamation-triangle me-2"></i>Module 2</h6>
                            <p class="small text-muted mb-0">Disaster & Affected Population Management</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-3 border rounded bg-dark border-secondary">
                            <h6 class="text-success"><i class="bi bi-house-check me-2"></i>Module 3</h6>
                            <p class="small text-muted mb-0">Shelter Management & Readiness Assessment</p>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="p-3 border rounded bg-dark border-secondary">
                            <h6 class="text-info"><i class="bi bi-cpu me-2"></i>Module 4</h6>
                            <p class="small text-muted mb-0">Intelligent Shelter Allocation</p>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="p-3 border rounded bg-dark border-secondary">
                            <h6 class="text-danger"><i class="bi bi-bell me-2"></i>Module 5</h6>
                            <p class="small text-muted mb-0">Emergency Reallocation, Alerts & Reports</p>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-center gap-3 mt-4">
                    <a href="login.jsp" class="btn btn-primary btn-lg px-4"><i class="bi bi-box-arrow-in-right me-2"></i>Login</a>
                    <a href="register.jsp" class="btn btn-outline-light btn-lg px-4"><i class="bi bi-person-plus me-2"></i>Register</a>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
