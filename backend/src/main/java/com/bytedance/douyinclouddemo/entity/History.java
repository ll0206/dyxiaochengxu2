package com.bytedance.douyinclouddemo.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long caseId;
    private String title;
    private String carModel;
    private String upgradeTarget;
    private String image;
    private LocalDateTime viewTime;

    @PrePersist
    public void onCreate() {
        viewTime = LocalDateTime.now();
    }
}
