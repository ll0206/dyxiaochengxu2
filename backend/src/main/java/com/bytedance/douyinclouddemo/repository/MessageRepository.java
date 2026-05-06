package com.bytedance.douyinclouddemo.repository;

import com.bytedance.douyinclouddemo.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByUserIdOrderByCreateTimeDesc(Long userId);
    long countByUserIdAndReadFalse(Long userId);
}
