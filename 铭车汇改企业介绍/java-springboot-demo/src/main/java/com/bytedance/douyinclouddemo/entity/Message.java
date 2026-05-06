package com.bytedance.douyinclouddemo.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String type;
    private String title;
    private String content;
    private boolean read = false;
    private LocalDateTime createTime;

    @PrePersist
    public void onCreate() {
        createTime = LocalDateTime.now();
    }
}
