package com.bytedance.douyinclouddemo.repository;

import com.bytedance.douyinclouddemo.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findAllByOrderBySortOrderAsc();
}
