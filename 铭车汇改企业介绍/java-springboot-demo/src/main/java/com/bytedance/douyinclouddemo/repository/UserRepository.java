package com.bytedance.douyinclouddemo.repository;

import com.bytedance.douyinclouddemo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByOpenId(String openId);
}
