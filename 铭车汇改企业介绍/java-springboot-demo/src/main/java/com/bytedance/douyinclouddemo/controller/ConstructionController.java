package com.bytedance.douyinclouddemo.controller;

import com.alibaba.fastjson2.JSON;
import com.bytedance.douyinclouddemo.dto.ApiResponse;
import com.bytedance.douyinclouddemo.entity.ConstructionStatus;
import com.bytedance.douyinclouddemo.repository.ConstructionStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ConstructionController {

    @Autowired
    private ConstructionStatusRepository constructionStatusRepository;

    @GetMapping("/construction/status")
    public ApiResponse<Map<String, Object>> getStatus(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        ConstructionStatus cs = constructionStatusRepository.findByUserId(userId).orElse(null);
        if (cs == null) {
            return ApiResponse.fail(404, "暂无施工信息");
        }
        Map<String, Object> data = new HashMap<>();
        data.put("stage", cs.getStage());
        data.put("carModel", cs.getCarModel());
        data.put("project", cs.getProject());
        data.put("startDate", cs.getStartDate());
        data.put("expectedDate", cs.getExpectedDate());
        data.put("updates", JSON.parseArray(cs.getUpdates()));
        return ApiResponse.ok(data);
    }
}
