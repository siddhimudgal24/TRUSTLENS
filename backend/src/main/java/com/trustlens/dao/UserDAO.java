package com.trustlens.dao;

import com.trustlens.model.User;
import java.util.List;

public interface UserDAO {
    User authenticate(String usernameOrEmail, String plainPassword);
    boolean registerUser(User user, String plainPassword);
    User getUserById(int userId);
    User getUserByUsername(String username);
    User getUserByEmail(String email);
    List<User> getAllUsers();
    boolean updateUser(User user);
    boolean updatePassword(String email, String newPlainPassword);
    boolean deleteUser(int userId);
}
