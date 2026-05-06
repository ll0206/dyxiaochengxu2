package com.bytedance.douyinclouddemo.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.bytedance.douyinclouddemo.config.JwtUtil;
import com.bytedance.douyinclouddemo.dto.ApiResponse;
import com.bytedance.douyinclouddemo.entity.User;
import com.bytedance.douyinclouddemo.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${app.secret}")
    private String appSecret;

    @Value("${app.id}")
    private String appId;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/douyin-login")
    public ApiResponse<Map<String, String>> douyinLogin(@RequestBody Map<String, String> req) {
        String code = req.get("code");
        if (code == null || code.isEmpty()) {
            return ApiResponse.fail(1, "code不能为空");
        }

        String openId;
        try {
            openId = getOpenIdByCode(code);
        } catch (Exception e) {
            log.error("抖音登录失败: {}", e.getMessage());
            return ApiResponse.fail(1, "登录失败: " + e.getMessage());
        }

        Optional<User> existing = userRepository.findByOpenId(openId);
        User user;
        if (existing.isPresent()) {
            user = existing.get();
        } else {
            user = new User();
            user.setOpenId(openId);
            user = userRepository.save(user);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getOpenId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        Map<String, String> data = new HashMap<>();
        data.put("token", token);
        data.put("refreshToken", refreshToken);
        data.put("userId", String.valueOf(user.getId()));
        return ApiResponse.ok(data);
    }

    @PostMapping("/refresh")
    public ApiResponse<Map<String, String>> refreshToken(@RequestBody Map<String, String> req) {
        String refToken = req.get("refreshToken");
        if (refToken == null || refToken.isEmpty()) {
            return ApiResponse.fail(1, "refreshToken不能为空");
        }
        try {
            Long userId = jwtUtil.getUserId(refToken);
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return ApiResponse.fail(401, "用户不存在");
            }
            String token = jwtUtil.generateToken(userId, user.getOpenId());
            String newRefreshToken = jwtUtil.generateRefreshToken(userId);
            Map<String, String> data = new HashMap<>();
            data.put("token", token);
            data.put("refreshToken", newRefreshToken);
            return ApiResponse.ok(data);
        } catch (Exception e) {
            return ApiResponse.fail(401, "refreshToken无效");
        }
    }

    @PostMapping("/bind-phone")
    public ApiResponse<Void> bindPhone(@RequestBody Map<String, String> req, HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ApiResponse.fail("用户不存在");
        user.setPhone("188****3820");
        userRepository.save(user);
        return ApiResponse.ok(null);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        log.info("用户登出: userId={}", userId);
        return ApiResponse.ok(null);
    }

    private String getOpenIdByCode(String code) throws Exception {
        String urlStr = "https://developer.toutiao.com/api/apps/v2/token";
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json; charset=utf-8");
        conn.setConnectTimeout(10000);
        conn.setReadTimeout(10000);
        conn.setDoOutput(true);

        Map<String, String> body = new HashMap<>();
        body.put("appid", appId);
        body.put("secret", appSecret);
        body.put("code", code);
        body.put("grant_type", "authorization_code");

        String jsonBody = JSON.toJSONString(body);
        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonBody.getBytes(StandardCharsets.UTF_8));
        }

        int code2 = conn.getResponseCode();
        InputStream is = (code2 >= 200 && code2 < 300) ? conn.getInputStream() : conn.getErrorStream();
        String response;
        try (BufferedReader br = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
            response = sb.toString();
        }

        if (code2 != 200) {
            throw new RuntimeException("API返回错误: " + code2 + " " + response);
        }

        JSONObject result = JSON.parseObject(response);
        if (result.getInteger("err_no") != 0) {
            throw new RuntimeException(result.getString("err_tips"));
        }
        return result.getJSONObject("data").getString("openid");
    }
}
