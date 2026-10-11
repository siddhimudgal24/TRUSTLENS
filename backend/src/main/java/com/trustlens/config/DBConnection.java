package com.trustlens.config;

import com.trustlens.util.DotenvUtil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static String getUrl() {
        return DotenvUtil.get("DB_URL", "jdbc:mysql://localhost:3306/trustlens_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata");
    }

    private static String getUser() {
        return DotenvUtil.get("DB_USER", "root");
    }

    private static String getPassword() {
        return DotenvUtil.get("DB_PASSWORD", "Shorya@11@sql");
    }

    static {
        try {
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
            } catch (ClassNotFoundException ignored) {}

            try {
                Class.forName("org.postgresql.Driver");
            } catch (ClassNotFoundException ignored) {}
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(getUrl(), getUser(), getPassword());
    }

    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    // Quick test runner to verify database connection
    public static void main(String[] args) {
        try (Connection conn = getConnection()) {
            if (conn != null && !conn.isClosed()) {
                System.out.println("=================================================");
                System.out.println("SUCCESS: Connected to MySQL database [trustlens_db]!");
                System.out.println("Database Product: " + conn.getMetaData().getDatabaseProductName());
                System.out.println("Database Version: " + conn.getMetaData().getDatabaseProductVersion());
                System.out.println("=================================================");
            }
        } catch (SQLException e) {
            System.err.println("FAILED to connect to MySQL database!");
            e.printStackTrace();
        }
    }
}
