package com.bytedance.douyinclouddemo.config;

import com.alibaba.fastjson2.JSON;
import com.bytedance.douyinclouddemo.dto.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (token == null || token.isEmpty()) {
            writeResponse(response, 401, "未登录");
            return false;
        }
        try {
            Long userId = jwtUtil.getUserId(token);
            request.setAttribute("userId", userId);
            request.setAttribute("openId", jwtUtil.getOpenId(token));
            return true;
        } catch (ExpiredJwtException e) {
            ApiResponse<Void> r = ApiResponse.fail(401, "token_expired");
            writeJson(response, r);
            return false;
        } catch (JwtException e) {
            writeResponse(response, 401, "token_invalid");
            return false;
        }
    }

    private void writeResponse(HttpServletResponse response, int code, String message) throws Exception {
        ApiResponse<Void> r = ApiResponse.fail(code, message);
        writeJson(response, r);
    }

    private void writeJson(HttpServletResponse response, ApiResponse<Void> r) throws Exception {
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(JSON.toJSONString(r));
    }
}
