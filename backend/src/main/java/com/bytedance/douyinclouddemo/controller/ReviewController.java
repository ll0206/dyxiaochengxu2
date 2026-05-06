package com.bytedance.douyinclouddemo.controller;

import com.bytedance.douyinclouddemo.dto.ApiResponse;
import com.bytedance.douyinclouddemo.entity.Review;
import com.bytedance.douyinclouddemo.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/reviews")
    public ApiResponse<Map<String, Object>> getReviews(
            @RequestParam(required = false) Long caseId,
            @RequestParam(defaultValue = "1") int page) {
        Pageable pageable = PageRequest.of(page - 1, 10);
        Page<Review> reviewPage;
        if (caseId != null) {
            reviewPage = reviewRepository.findByCaseIdAndStatusOrderByCreateTimeDesc(caseId, "approved", pageable);
        } else {
            reviewPage = reviewRepository.findByStatusOrderByCreateTimeDesc("approved", pageable);
        }
        Map<String, Object> data = new HashMap<>();
        data.put("list", reviewPage.getContent());
        data.put("total", reviewPage.getTotalElements());
        data.put("page", page);
        return ApiResponse.ok(data);
    }

    @PostMapping("/reviews")
    public ApiResponse<Map<String, Object>> submitReview(@RequestBody Map<String, Object> req, HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        Review review = new Review();
        review.setUserId(userId);
        review.setNickname((String) req.get("nickname"));
        review.setAvatarUrl((String) req.get("avatarUrl"));
        review.setCarModel((String) req.get("carModel"));
        review.setServiceItem((String) req.get("serviceItem"));
        review.setStars(((Number) req.get("stars")).intValue());
        review.setContent((String) req.get("content"));
        review.setStatus("pending");
        reviewRepository.save(review);

        Map<String, Object> data = new HashMap<>();
        data.put("id", review.getId());
        return ApiResponse.ok(data);
    }

    @GetMapping("/user/reviews")
    public ApiResponse<Map<String, Object>> getMyReviews(
            @RequestParam(defaultValue = "1") int page,
            HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        Pageable pageable = PageRequest.of(page - 1, 10);
        Page<Review> reviewPage = reviewRepository.findByUserIdOrderByCreateTimeDesc(userId, pageable);
        Map<String, Object> data = new HashMap<>();
        data.put("list", reviewPage.getContent());
        data.put("total", reviewPage.getTotalElements());
        return ApiResponse.ok(data);
    }
}
