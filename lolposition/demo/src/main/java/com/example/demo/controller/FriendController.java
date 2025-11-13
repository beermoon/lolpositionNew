package com.example.demo.controller;


import com.example.demo.entity.Friend;
import com.example.demo.repository.FriendRepository;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/friends")
public class FriendController {

    private final FriendRepository friendRepository;

    public FriendController(FriendRepository friendRepository) {
        this.friendRepository = friendRepository;
    }

    // 전체 조회
    @GetMapping
    public List<Friend> getFriends() {
        return friendRepository.findAll();
    }


    // 친구 추가하기
    @PostMapping
    public void addFriend(@RequestBody FriendRequest request) {
        String name = request.getName();
        if (name == null || name.isBlank()) return;
        if (friendRepository.existsByName(name)) return;
        friendRepository.save(new Friend(name));
    }

    // 요청 바디용 DTO
    public static class FriendRequest {
        private String name;
        public String getName() {return name;}
        public void setName(String name) {this.name = name;}
    }

    // 친구 삭제
    @DeleteMapping("/{id}")
    public void deleteFriend(@PathVariable Long id) {
        friendRepository.deleteById(id);
    }

    // 친구 이름 수정
    @PutMapping("/{id}")
    public void updateFriend(@PathVariable Long id, @RequestBody FriendRequest request) {
        String name = request.getName();
        if (name == null || name.isBlank()) return;
        // 중복 이름 방지
        if (friendRepository.existsByName(name)) return;

        friendRepository.findById(id).ifPresent(friend -> {
            friend.setName(name);
            friendRepository.save(friend);
        });
    }


}
