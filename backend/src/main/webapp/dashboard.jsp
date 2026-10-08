<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.trustlens.model.User" %>
<%
    User currentUser = (User) session.getAttribute("currentUser");
    if (currentUser == null) {
        response.sendRedirect("login.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>TrustLens | Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .sidebar { background: #1e293b; min-height: 100vh; border-right: 1px solid rgba(255,255,255,0.1); }
        .card-custom { background: #1e293b; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; }
        .nav-link.active { background-color: #3b82f6 !important; color: white !important; }
        .nav-link { color: #94a3b8; }
        .nav-link:hover { color: #f8fafc; }
    </style>
</head>
<body>

<div class="d-flex">
    <!-- Sidebar navigation -->
    <div class="sidebar p-3 d-flex flex-column" style="width: 260px;">
        <a href="dashboard.jsp" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none px-2">
            <i class="bi bi-shield-check fs-3 me-2 text-primary"></i>
            <span class="fs-5 fw-bold">TrustLens</span>
        </a>
        <hr class="text-secondary">
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item mb-1">
                <a href="dashboard.jsp" class="nav-link active">
                    <i class="bi bi-speedometer2 me-2"></i> Dashboard
                </a>
            </li>
            <li class="nav-item mb-1">
                <a href="#" class="nav-link">
                    <i class="bi bi-people me-2"></i> User Management (M1)
                </a>
            </li>
            <li class="nav-item mb-1">
                <a href="#" class="nav-link">
                    <i class="bi bi-exclamation-triangle me-2"></i> Disasters (M2)
                </a>
            </li>
            <li class="nav-item mb-1">
                <a href="#" class="nav-link">
                    <i class="bi bi-house-door me-2"></i> Shelters (M3)
                </a>
            </li>
            <li class="nav-item mb-1">
                <a href="#" class="nav-link">
                    <i class="bi bi-cpu me-2"></i> Allocations (M4)
                </a>
            </li>
            <li class="nav-item mb-1">
                <a href="#" class="nav-link">
                    <i class="bi bi-bell me-2"></i> Reallocation & Alerts (M5)
                </a>
            </li>
        </ul>
        <hr class="text-secondary">
        <div class="dropdown">
            <div class="d-flex align-items-center justify-content-between">
                <div>
                    <strong class="d-block text-white"><%= currentUser.getFullName() %></strong>
                    <small class="text-muted"><%= currentUser.getRoleName() %></small>
                </div>
                <a href="logout" class="btn btn-sm btn-outline-danger"><i class="bi bi-box-arrow-right"></i></a>
            </div>
        </div>
    </div>

    <!-- Main Content Area -->
    <div class="flex-grow-1 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="fw-bold mb-0 text-white">Emergency Operations Center</h2>
                <p class="text-secondary mb-0">Role-based dynamic allocation and readiness portal</p>
            </div>
            <span class="badge bg-success px-3 py-2 fs-6"><i class="bi bi-circle-fill me-1 small"></i> System Active</span>
        </div>

        <div class="row g-4 mb-4">
            <div class="col-md-3">
                <div class="card card-custom p-3">
                    <span class="text-secondary small">Active Disasters</span>
                    <h3 class="text-warning fw-bold mt-2">1</h3>
                    <small class="text-muted">Module 2 Scope</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-custom p-3">
                    <span class="text-secondary small">Total Shelters</span>
                    <h3 class="text-primary fw-bold mt-2">3</h3>
                    <small class="text-muted">Module 3 Scope</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-custom p-3">
                    <span class="text-secondary small">Total Capacity</span>
                    <h3 class="text-info fw-bold mt-2">2,800</h3>
                    <small class="text-muted">Module 4 Scope</small>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card card-custom p-3">
                    <span class="text-secondary small">Emergency Alerts</span>
                    <h3 class="text-danger fw-bold mt-2">0</h3>
                    <small class="text-muted">Module 5 Scope</small>
                </div>
            </div>
        </div>

        <div class="card card-custom p-4">
            <h5 class="text-white mb-3"><i class="bi bi-kanban me-2"></i>Module Architecture & Branch Mapping</h5>
            <div class="table-responsive">
                <table class="table table-dark table-hover align-middle">
                    <thead>
                        <tr class="text-secondary">
                            <th>Module</th>
                            <th>Features</th>
                            <th>Target Branch</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong class="text-primary">Module 1</strong></td>
                            <td>Login/Register, BCrypt Hashing, Sessions, Roles, User CRUD</td>
                            <td><code>feature/auth-admin</code></td>
                        </tr>
                        <tr>
                            <td><strong class="text-warning">Module 2</strong></td>
                            <td>Disaster CRUD, Severity, Affected Zones & Populations</td>
                            <td><code>feature/disaster-management</code></td>
                        </tr>
                        <tr>
                            <td><strong class="text-success">Module 3</strong></td>
                            <td>Shelter CRUD, Capacity/Occupancy, Readiness Score</td>
                            <td><code>feature/shelter-management</code></td>
                        </tr>
                        <tr>
                            <td><strong class="text-info">Module 4</strong></td>
                            <td>Shelter Recommendation & Intelligent Allocation Algorithm</td>
                            <td><code>feature/allocation</code></td>
                        </tr>
                        <tr>
                            <td><strong class="text-danger">Module 5</strong></td>
                            <td>Unsafe Reallocation, Alerts, Reports Audit</td>
                            <td><code>feature/reallocation</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
