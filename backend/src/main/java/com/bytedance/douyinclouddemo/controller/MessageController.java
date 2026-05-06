package com.bytedance.douyinclouddemo.controller;

import com.bytedance.douyinclouddemo.dto.ApiResponse;
import com.bytedance.douyinclouddemo.entity.Message;
import com.bytedance.douyinclouddemo.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @GetMapping("/messages")
    public ApiResponse<Map<String, Object>> getMessages(
            @RequestParam(defaultValue = "1") int page,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<Message> list = messageRepository.findByUserIdOrderByCreateTimeDesc(userId);
        Map<String, Object> data = new HashMap<>();
        data.put("list", list);
        data.put("total", list.size());
        return ApiResponse.ok(data);
    }

    @GetMapping("/messages/unread-count")
    public ApiResponse<Map<String, Object>> getUnreadCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        long count = messageRepository.countByUserIdAndReadFalse(userId);
        Map<String, Object> data = new HashMap<>();
        data.put("count", count);
        return ApiResponse.ok(data);
    }
}
