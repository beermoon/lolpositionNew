package com.example.demo.repository;

import com.example.demo.entity.Friend;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendRepository extends JpaRepository<Friend,Long> {
    boolean existsByName(String name);
}
