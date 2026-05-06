package com.bytedance.douyinclouddemo.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class ConstructionStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String stage;
    private String carModel;
    private String project;
    private String startDate;
    private String expectedDate;

    @Column(columnDefinition = "TEXT")
    private String updates;

    private LocalDateTime createTime;
    private LocalDateTime updateTime;

    @PrePersist
    public void onCreate() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updateTime = LocalDateTime.now();
    }
}
