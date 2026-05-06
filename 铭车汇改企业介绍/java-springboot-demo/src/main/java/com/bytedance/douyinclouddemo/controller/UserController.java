package com.bytedance.douyinclouddemo.controller;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;
import com.bytedance.douyinclouddemo.dto.ApiResponse;
import com.bytedance.douyinclouddemo.entity.User;
import com.bytedance.douyinclouddemo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ApiResponse<Map<String, Object>> getProfile(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ApiResponse.fail(404, "用户不存在");
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("nickname", user.getNickname());
        data.put("avatarUrl", user.getAvatarUrl());
        data.put("phone", user.getPhone());
        data.put("openId", user.getOpenId());
        if (user.getCarInfo() != null && !user.getCarInfo().isEmpty()) {
            data.put("carInfo", JSON.parse(user.getCarInfo()));
        }
        return ApiResponse.ok(data);
    }

    @PutMapping("/profile")
    public ApiResponse<Void> updateProfile(@RequestBody Map<String, String> req, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ApiResponse.fail("用户不存在");
        if (req.containsKey("nickname")) user.setNickname(req.get("nickname"));
        if (req.containsKey("avatarUrl")) user.setAvatarUrl(req.get("avatarUrl"));
        if (req.containsKey("carInfo")) {
            user.setCarInfo(req.get("carInfo"));
        }
        userRepository.save(user);
        return ApiResponse.ok(null);
    }

    @GetMapping("/favorites")
    public ApiResponse<Map<String, Object>> getFavorites(
            @RequestParam(defaultValue = "1") int page,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.ok(new HashMap<String, Object>());
    }

    @GetMapping("/history")
    public ApiResponse<Map<String, Object>> getHistory(
            @RequestParam(defaultValue = "1") int page,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return ApiResponse.ok(new HashMap<String, Object>());
    }

    @DeleteMapping("/history")
    public ApiResponse<Void> clearHistory(HttpServletRequest request) {
        return ApiResponse.ok(null);
    }

    @GetMapping("/reviews")
    public ApiResponse<Map<String, Object>> getMyReviews(
            @RequestParam(defaultValue = "1") int page,
            HttpServletRequest request) {
        return ApiResponse.ok(new HashMap<String, Object>());
    }
}
