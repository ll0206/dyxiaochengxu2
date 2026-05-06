package com.bytedance.douyinclouddemo.controller;

import com.bytedance.douyinclouddemo.dto.ApiResponse;
import com.bytedance.douyinclouddemo.entity.Banner;
import com.bytedance.douyinclouddemo.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    @GetMapping("/banners")
    public ApiResponse<Map<String, Object>> getBanners() {
        List<Banner> list = bannerRepository.findAllByOrderBySortOrderAsc();
        Map<String, Object> data = new HashMap<>();
        data.put("list", list);
        return ApiResponse.ok(data);
    }
}
