package com.bytedance.douyinclouddemo.repository;

import com.bytedance.douyinclouddemo.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserIdOrderByCreateTimeDesc(Long userId);
    Optional<Favorite> findByUserIdAndCaseId(Long userId, Long caseId);
    void deleteByUserIdAndCaseId(Long userId, Long caseId);
    boolean existsByUserIdAndCaseId(Long userId, Long caseId);
}
