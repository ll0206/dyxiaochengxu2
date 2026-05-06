package com.bytedance.douyinclouddemo.controller;

import com.bytedance.douyinclouddemo.dto.ApiResponse;
import com.bytedance.douyinclouddemo.entity.Coupon;
import com.bytedance.douyinclouddemo.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    @GetMapping("/coupons")
    public ApiResponse<Map<String, Object>> getCoupons() {
        List<Coupon> list = couponRepository.findByActiveTrue();
        Map<String, Object> data = new HashMap<>();
        data.put("list", list);
        return ApiResponse.ok(data);
    }
}
