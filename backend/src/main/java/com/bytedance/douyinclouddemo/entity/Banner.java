package com.bytedance.douyinclouddemo.entity;

import lombok.Data;
import javax.persistence.*;

@Entity
@Data
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String imageUrl;
    private String linkUrl;
    private String title;
    private int sortOrder = 0;
}
