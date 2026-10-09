package com.trustlens.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class DotenvUtil {

    private static final Map<String, String> envMap = new HashMap<>();

    static {
        loadDotenv();
    }

    private static void loadDotenv() {
        File envFile = new File(".env");
        if (!envFile.exists()) {
            envFile = new File("backend/.env");
        }

        if (envFile.exists()) {
            try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) continue;

                    int idx = line.indexOf('=');
                    if (idx > 0) {
                        String key = line.substring(0, idx).trim();
                        String value = line.substring(idx + 1).trim();
                        envMap.put(key, value);
                    }
                }
            } catch (IOException e) {
                System.err.println("Notice: Failed to read .env file: " + e.getMessage());
            }
        }
    }

    public static String get(String key, String defaultValue) {
        // 1. Check System Environment variables
        String sysValue = System.getenv(key);
        if (sysValue != null && !sysValue.isEmpty()) {
            return sysValue;
        }

        // 2. Check loaded .env file
        String dotenvValue = envMap.get(key);
        if (dotenvValue != null && !dotenvValue.isEmpty()) {
            return dotenvValue;
        }

        // 3. Fallback default
        return defaultValue;
    }
}
