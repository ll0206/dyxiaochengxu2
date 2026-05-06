package com.bytedance.douyinclouddemo.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private String phone;
    private String carModel;
    private String licensePlate;
    private String serviceType;
    private String appointmentDate;
    private String timeSlot;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status = "pending";

    private LocalDateTime createTime;

    @PrePersist
    public void onCreate() {
        createTime = LocalDateTime.now();
    }
}
