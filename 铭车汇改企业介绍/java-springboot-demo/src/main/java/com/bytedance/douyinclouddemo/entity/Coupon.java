package com.bytedance.douyinclouddemo.entity;

import lombok.Data;
import javax.persistence.*;

@Entity
@Data
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private int discountAmount;
    private int minSpend;
    private String discountType;
    private boolean active = true;
}
