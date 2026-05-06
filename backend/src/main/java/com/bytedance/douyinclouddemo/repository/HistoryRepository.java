package com.bytedance.douyinclouddemo.repository;

import com.bytedance.douyinclouddemo.entity.History;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistoryRepository extends JpaRepository<History, Long> {
    List<History> findByUserIdOrderByViewTimeDesc(Long userId);
    void deleteByUserId(Long userId);
    List<History> findByUserIdAndCaseId(Long userId, Long caseId);
}
