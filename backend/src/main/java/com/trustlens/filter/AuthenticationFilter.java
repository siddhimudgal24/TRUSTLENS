package com.trustlens.filter;

import com.trustlens.model.User;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebFilter("/*")
public class AuthenticationFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {}

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String path = req.getRequestURI().substring(req.getContextPath().length());

        // Allow static assets and auth pages without login
        if (path.startsWith("/css") || path.startsWith("/js") || path.startsWith("/images") ||
            path.equals("/login") || path.equals("/register") || path.equals("/login.jsp") || path.equals("/register.jsp")) {
            chain.doFilter(request, response);
            return;
        }

        HttpSession session = req.getSession(false);
        User currentUser = (session != null) ? (User) session.getAttribute("currentUser") : null;

        if (currentUser == null) {
            res.sendRedirect(req.getContextPath() + "/login.jsp?error=please_login");
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {}
}
