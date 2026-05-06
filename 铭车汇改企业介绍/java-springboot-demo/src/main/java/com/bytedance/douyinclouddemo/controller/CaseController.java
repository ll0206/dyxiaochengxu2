package com.bytedance.douyinclouddemo.controller;

import com.bytedance.douyinclouddemo.dto.ApiResponse;
import com.bytedance.douyinclouddemo.entity.Favorite;
import com.bytedance.douyinclouddemo.entity.History;
import com.bytedance.douyinclouddemo.entity.LikeRecord;
import com.bytedance.douyinclouddemo.repository.FavoriteRepository;
import com.bytedance.douyinclouddemo.repository.HistoryRepository;
import com.bytedance.douyinclouddemo.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/cases")
public class CaseController {

    @Autowired
    private FavoriteRepository favoriteRepository;
    @Autowired
    private LikeRepository likeRepository;
    @Autowired
    private HistoryRepository historyRepository;

    @GetMapping
    public ApiResponse<Map<String, Object>> getCases(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page) {
        // Return empty list - frontend falls back to local case-data.js
        Map<String, Object> data = new HashMap<>();
        data.put("list", new java.util.ArrayList<>());
        data.put("total", 0);
        return ApiResponse.ok(data);
    }

    @GetMapping("/{id}")
    public ApiResponse<Map<String, Object>> getCaseDetail(@PathVariable Long id) {
        // Return empty - frontend falls back to local data
        return ApiResponse.ok(new HashMap<String, Object>());
    }

    @PostMapping("/{caseId}/view")
    public ApiResponse<Void> recordView(@PathVariable Long caseId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        History h = new History();
        h.setUserId(userId);
        h.setCaseId(caseId);
        historyRepository.save(h);
        return ApiResponse.ok(null);
    }

    @PostMapping("/{caseId}/like")
    public ApiResponse<Map<String, Object>> toggleLike(@PathVariable Long caseId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Optional<LikeRecord> existing = likeRepository.findByUserIdAndCaseId(userId, caseId);
        boolean liked;
        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            liked = false;
        } else {
            LikeRecord lr = new LikeRecord();
            lr.setUserId(userId);
            lr.setCaseId(caseId);
            likeRepository.save(lr);
            liked = true;
        }
        long count = likeRepository.countByCaseId(caseId);
        Map<String, Object> data = new HashMap<>();
        data.put("liked", liked);
        data.put("count", count);
        return ApiResponse.ok(data);
    }

    @PostMapping("/{caseId}/favorite")
    public ApiResponse<Map<String, Object>> toggleFavorite(@PathVariable Long caseId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Optional<Favorite> existing = favoriteRepository.findByUserIdAndCaseId(userId, caseId);
        boolean favorited;
        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
            favorited = false;
        } else {
            Favorite f = new Favorite();
            f.setUserId(userId);
            f.setCaseId(caseId);
            favoriteRepository.save(f);
            favorited = true;
        }
        Map<String, Object> data = new HashMap<>();
        data.put("favorited", favorited);
        return ApiResponse.ok(data);
    }
}
