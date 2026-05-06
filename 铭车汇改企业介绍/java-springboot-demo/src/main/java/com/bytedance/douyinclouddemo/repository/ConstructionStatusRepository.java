package com.bytedance.douyinclouddemo.repository;

import com.bytedance.douyinclouddemo.entity.ConstructionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConstructionStatusRepository extends JpaRepository<ConstructionStatus, Long> {
    Optional<ConstructionStatus> findByUserId(Long userId);
}
