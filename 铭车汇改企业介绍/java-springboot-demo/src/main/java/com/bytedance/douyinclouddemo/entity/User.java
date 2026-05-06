package com.bytedance.douyinclouddemo.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String openId;
    private String nickname;
    private String avatarUrl;
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String carInfo;

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
