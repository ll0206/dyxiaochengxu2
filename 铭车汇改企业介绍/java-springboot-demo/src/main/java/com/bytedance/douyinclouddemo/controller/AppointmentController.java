package com.bytedance.douyinclouddemo.controller;

import com.bytedance.douyinclouddemo.dto.ApiResponse;
import com.bytedance.douyinclouddemo.entity.Appointment;
import com.bytedance.douyinclouddemo.entity.ConstructionStatus;
import com.bytedance.douyinclouddemo.repository.AppointmentRepository;
import com.bytedance.douyinclouddemo.repository.ConstructionStatusRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private ConstructionStatusRepository constructionStatusRepository;

    @PostMapping("/appointments")
    public ApiResponse<Map<String, Object>> createAppointment(@RequestBody Map<String, String> req, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        Appointment appt = new Appointment();
        appt.setUserId(userId);
        appt.setName(req.getOrDefault("name", ""));
        appt.setPhone(req.getOrDefault("phone", ""));
        appt.setCarModel(req.getOrDefault("carModel", ""));
        appt.setLicensePlate(req.getOrDefault("licensePlate", ""));
        appt.setServiceType(req.getOrDefault("serviceType", ""));
        appt.setAppointmentDate(req.getOrDefault("appointmentDate", ""));
        appt.setTimeSlot(req.getOrDefault("timeSlot", ""));
        appt.setDescription(req.getOrDefault("description", ""));
        appointmentRepository.save(appt);

        // Auto-create construction status if not exists
        if (constructionStatusRepository.findByUserId(userId).isEmpty()) {
            ConstructionStatus cs = new ConstructionStatus();
            cs.setUserId(userId);
            cs.setStage("pending");
            cs.setCarModel(appt.getCarModel());
            cs.setProject(appt.getServiceType());
            cs.setStartDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            cs.setUpdates("[]");
            constructionStatusRepository.save(cs);
        }

        Map<String, Object> data = new HashMap<>();
        data.put("id", appt.getId());
        data.put("status", appt.getStatus());
        return ApiResponse.ok(data);
    }

    @GetMapping("/appointments")
    public ApiResponse<List<Appointment>> getAppointments(
            @RequestParam(defaultValue = "1") int page,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<Appointment> list = appointmentRepository.findByUserIdOrderByCreateTimeDesc(userId);
        return ApiResponse.ok(list);
    }
}
