package com.trustlens.servlet;

import com.trustlens.dao.UserDAO;
import com.trustlens.dao.impl.UserDAOImpl;
import com.trustlens.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet(urlPatterns = {"/login", "/register", "/logout"})
public class AuthServlet extends HttpServlet {

    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        this.userDAO = new UserDAOImpl();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String servletPath = req.getServletPath();

        if ("/login".equals(servletPath)) {
            handleLogin(req, resp);
        } else if ("/register".equals(servletPath)) {
            handleRegister(req, resp);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String servletPath = req.getServletPath();

        if ("/logout".equals(servletPath)) {
            HttpSession session = req.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            resp.sendRedirect(req.getContextPath() + "/login.jsp?logout=true");
        }
    }

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String username = req.getParameter("username");
        String plainPass = req.getParameter("password");

        User user = userDAO.authenticate(username, plainPass);
        if (user != null) {
            HttpSession session = req.getSession(true);
            session.setAttribute("currentUser", user);
            resp.sendRedirect(req.getContextPath() + "/dashboard.jsp");
        } else {
            resp.sendRedirect(req.getContextPath() + "/login.jsp?error=invalid_credentials");
        }
    }

    private void handleRegister(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        User user = new User();
        user.setFullName(req.getParameter("fullName"));
        user.setUsername(req.getParameter("username"));
        user.setEmail(req.getParameter("email"));
        user.setPhoneNumber(req.getParameter("phone"));
        
        int roleId = 4;
        try {
            roleId = Integer.parseInt(req.getParameter("roleId"));
        } catch (NumberFormatException ignored) {}
        user.setRoleId(roleId);

        String plainPass = req.getParameter("password");

        boolean success = userDAO.registerUser(user, plainPass);
        if (success) {
            resp.sendRedirect(req.getContextPath() + "/login.jsp?registered=true");
        } else {
            resp.sendRedirect(req.getContextPath() + "/register.jsp?error=failed");
        }
    }
}
