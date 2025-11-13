package com.example.demo.controller;


import org.springframework.web.bind.annotation.*;
import java.util.*;


@RestController
@RequestMapping("/api/assign")
public class AssignController {

    // 기본 롤 5개
    private static final List<String> ROLES = List.of("탑","정글","미드","원딜","서폿");

    @PostMapping
    public List<AssignResponse> assign(@RequestBody AssignRequest request) {
        List<String> players = request.getPlayers();
        if (players == null || players.isEmpty()) {
            return List.of();
        }

        // 포지션 섞기
        List<String> shuffleRoles = new ArrayList<>(ROLES);
        Collections.shuffle(shuffleRoles);

        List<AssignResponse> result = new ArrayList<>();

        // 사람 수가 5보다 많을 수도 있으니까 최소값
        int count = Math.min(players.size(),shuffleRoles.size());
        for (int i = 0; i < count; i++) {
            result.add(new AssignResponse(players.get(i), shuffleRoles.get(i)));
        }

        // 남는 살마은 대기로
        for (int i = count; i < players.size(); i++) {
            result.add(new AssignResponse(players.get(i), "대기"));
        }

        return result;

    }

    // 요청 DTO
    public static class AssignRequest {
        private List<String> players;
        public List<String> getPlayers() {return players; }
        public void setPlayers(List<String> players) {this.players = players; }
    }

    // 응답 DTO
    public static class AssignResponse {
        private String name;
        private String role;

        public AssignResponse(String name, String role) {
            this.name = name;
            this.role = role;
        }

        public String getName() {return name;}
        public String getRole() {return role;}

    }

}
