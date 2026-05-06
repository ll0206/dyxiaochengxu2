package com.bytedance.douyinclouddemo.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String nickname;
    private String avatarUrl;
    private Long caseId;
    private String carModel;
    private String serviceItem;
    private int stars;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String status = "approved";
    private LocalDateTime createTime;

    @PrePersist
    public void onCreate() {
        createTime = LocalDateTime.now();
    }
}
