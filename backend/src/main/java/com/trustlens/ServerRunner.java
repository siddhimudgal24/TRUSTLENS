package com.trustlens;

import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import com.trustlens.config.DBConnection;
import com.trustlens.dao.UserDAO;
import com.trustlens.dao.OtpDAO;
import com.trustlens.dao.impl.UserDAOImpl;
import com.trustlens.dao.impl.OtpDAOImpl;
import com.trustlens.model.User;
import com.trustlens.model.OtpVerification;
import com.trustlens.util.EmailUtil;
import com.google.gson.JsonObject;

import java.io.IOException;
import java.io.OutputStream;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class ServerRunner {

    private static final int PORT = 8080;
    private static final UserDAO userDAO = new UserDAOImpl();
    private static final OtpDAO otpDAO = new OtpDAOImpl();

    public static void main(String[] args) throws IOException {
        System.out.println("=================================================");
        System.out.println("Starting TrustLens Java Backend Server on port " + PORT + "...");
        
        // Verify DB Connection on startup
        try (Connection conn = DBConnection.getConnection()) {
            if (conn != null && !conn.isClosed()) {
                System.out.println("✅ MySQL Database Connected: trustlens_db");
            }
        } catch (Exception e) {
            System.err.println("❌ MySQL Connection Error: " + e.getMessage());
        }

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // CORS & Root handler
        server.createContext("/api/login", new LoginHandler());
        server.createContext("/api/register", new RegisterHandler());
        server.createContext("/api/send-otp", new SendOtpHandler());
        server.createContext("/api/verify-otp", new VerifyOtpHandler());
        server.createContext("/api/forgot-password", new ForgotPasswordHandler());
        server.createContext("/api/reset-password", new ResetPasswordHandler());

        server.setExecutor(null);
        server.start();

        System.out.println("=================================================");
        System.out.println("🚀 Java Backend API Server is RUNNING at http://localhost:" + PORT);
        System.out.println("Endpoints Active:");
        System.out.println("  - POST http://localhost:" + PORT + "/api/login");
        System.out.println("  - POST http://localhost:" + PORT + "/register");
        System.out.println("  - POST http://localhost:" + PORT + "/api/send-otp");
        System.out.println("  - POST http://localhost:" + PORT + "/api/verify-otp");
        System.out.println("  - POST http://localhost:" + PORT + "/api/forgot-password");
        System.out.println("  - POST http://localhost:" + PORT + "/api/reset-password");
        System.out.println("=================================================");
    }

    private static void enableCorsAndHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    private static Map<String, String> parseQueryParams(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null || query.isEmpty()) return map;
        for (String param : query.split("&")) {
            String[] entry = param.split("=");
            if (entry.length > 1) {
                map.put(URLDecoder.decode(entry[0], StandardCharsets.UTF_8), URLDecoder.decode(entry[1], StandardCharsets.UTF_8));
            }
        }
        return map;
    }

    private static Map<String, String> parseBody(HttpExchange exchange) throws IOException {
        InputStream is = exchange.getRequestBody();
        String body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
        return parseQueryParams(body);
    }

    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCorsAndHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            Map<String, String> params = parseBody(exchange);
            String username = params.get("username");
            String password = params.get("password");

            JsonObject json = new JsonObject();
            User user = userDAO.authenticate(username, password);

            if (user != null) {
                json.addProperty("success", true);
                json.addProperty("message", "Login successful");
                json.addProperty("username", user.getUsername());
                json.addProperty("fullName", user.getFullName());
                json.addProperty("role", user.getRoleName());
            } else {
                json.addProperty("success", false);
                json.addProperty("message", "Invalid username or password");
            }

            byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(user != null ? 200 : 401, response.length);
            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();
        }
    }

    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCorsAndHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            Map<String, String> params = parseBody(exchange);
            String username = params.get("username");
            String email = params.get("email");

            JsonObject json = new JsonObject();

            if (userDAO.getUserByUsername(username) != null) {
                json.addProperty("success", false);
                json.addProperty("message", "Username '" + username + "' is already taken.");
            } else if (userDAO.getUserByEmail(email) != null) {
                json.addProperty("success", false);
                json.addProperty("message", "Email '" + email + "' is already registered.");
            } else {
                User user = new User();
                user.setFullName(params.get("fullName"));
                user.setUsername(username);
                user.setEmail(email);
                user.setPhoneNumber(params.get("phone"));
                try {
                    user.setRoleId(Integer.parseInt(params.getOrDefault("roleId", "4")));
                } catch (Exception ignored) {
                    user.setRoleId(4);
                }

                boolean success = userDAO.registerUser(user, params.get("password"));
                json.addProperty("success", success);
                json.addProperty("message", success ? "User registered successfully!" : "Registration failed.");
            }

            byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();
        }
    }

    static class SendOtpHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCorsAndHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            Map<String, String> query = parseQueryParams(exchange.getRequestURI().getQuery());
            String email = query.get("email");
            String purpose = query.getOrDefault("purpose", "REGISTRATION");

            JsonObject json = new JsonObject();
            if (email == null || !email.contains("@")) {
                json.addProperty("success", false);
                json.addProperty("message", "Invalid email address");
            } else {
                String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);
                Timestamp expiresAt = new Timestamp(System.currentTimeMillis() + (10 * 60 * 1000));
                boolean saved = otpDAO.saveOtp(new OtpVerification(email, otpCode, purpose, expiresAt));
                if (saved) {
                    // Send email asynchronously so API responds immediately
                    new Thread(() -> EmailUtil.sendOtpEmail(email, otpCode)).start();
                    json.addProperty("success", true);
                    json.addProperty("message", "OTP sent successfully to " + email);
                    json.addProperty("demoOtp", otpCode);
                } else {
                    json.addProperty("success", false);
                    json.addProperty("message", "Failed to save OTP");
                }
            }

            byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();
        }
    }

    static class VerifyOtpHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCorsAndHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            Map<String, String> query = parseQueryParams(exchange.getRequestURI().getQuery());
            String email = query.get("email");
            String otpCode = query.get("otp");
            String purpose = query.getOrDefault("purpose", "REGISTRATION");

            boolean isValid = otpDAO.verifyOtp(email, otpCode, purpose);
            JsonObject json = new JsonObject();
            json.addProperty("success", isValid);
            json.addProperty("message", isValid ? "OTP verified successfully" : "Invalid or expired OTP");

            byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();
        }
    }

    static class ForgotPasswordHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCorsAndHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            Map<String, String> query = parseQueryParams(exchange.getRequestURI().getQuery());
            String email = query.get("email");
            JsonObject json = new JsonObject();

            User user = userDAO.getUserByEmail(email);
            if (user == null) {
                json.addProperty("success", false);
                json.addProperty("message", "No account registered with this email");
            } else {
                String otpCode = String.format("%06d", new Random().nextInt(900000) + 100000);
                Timestamp expiresAt = new Timestamp(System.currentTimeMillis() + (10 * 60 * 1000));
                otpDAO.saveOtp(new OtpVerification(email, otpCode, "PASSWORD_RESET", expiresAt));
                new Thread(() -> EmailUtil.sendOtpEmail(email, otpCode)).start();
                json.addProperty("success", true);
                json.addProperty("message", "Recovery OTP sent to " + email);
                json.addProperty("demoOtp", otpCode);
            }

            byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();
        }
    }

    static class ResetPasswordHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            enableCorsAndHeaders(exchange);
            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            Map<String, String> query = parseQueryParams(exchange.getRequestURI().getQuery());
            String email = query.get("email");
            String otpCode = query.get("otp");
            String newPassword = query.get("newPassword");

            JsonObject json = new JsonObject();
            boolean isValidOtp = otpDAO.verifyOtp(email, otpCode, "PASSWORD_RESET");
            if (!isValidOtp) {
                json.addProperty("success", false);
                json.addProperty("message", "Invalid or expired OTP");
            } else {
                boolean updated = userDAO.updatePassword(email, newPassword);
                json.addProperty("success", updated);
                json.addProperty("message", updated ? "Password reset successfully!" : "Failed to update password.");
            }

            byte[] response = json.toString().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(200, response.length);
            OutputStream os = exchange.getResponseBody();
            os.write(response);
            os.close();
        }
    }
}
