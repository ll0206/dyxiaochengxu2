package com.bytedance.douyinclouddemo.repository;

import com.bytedance.douyinclouddemo.entity.LikeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeRecord, Long> {
    Optional<LikeRecord> findByUserIdAndCaseId(Long userId, Long caseId);
    void deleteByUserIdAndCaseId(Long userId, Long caseId);
    boolean existsByUserIdAndCaseId(Long userId, Long caseId);
    long countByCaseId(Long caseId);
}
