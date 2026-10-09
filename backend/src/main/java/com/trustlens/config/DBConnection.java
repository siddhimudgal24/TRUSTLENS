package com.trustlens.config;

import com.trustlens.util.DotenvUtil;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {

    private static final String URL = DotenvUtil.get("DB_URL", "jdbc:mysql://localhost:3306/trustlens_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Kolkata");
    private static final String USER = DotenvUtil.get("DB_USER", "root");
    private static final String PASSWORD = DotenvUtil.get("DB_PASSWORD", "Shorya@11@sql");
    private static final String DRIVER = "com.mysql.cj.jdbc.Driver";

    static {
        try {
            Class.forName(DRIVER);
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver Not Found in Classpath!");
            e.printStackTrace();
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
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
