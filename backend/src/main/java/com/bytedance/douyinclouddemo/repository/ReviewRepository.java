package com.bytedance.douyinclouddemo.repository;

import com.bytedance.douyinclouddemo.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByStatusOrderByCreateTimeDesc(String status, Pageable pageable);
    Page<Review> findByCaseIdAndStatusOrderByCreateTimeDesc(Long caseId, String status, Pageable pageable);
    Page<Review> findByUserIdOrderByCreateTimeDesc(Long userId, Pageable pageable);
}
