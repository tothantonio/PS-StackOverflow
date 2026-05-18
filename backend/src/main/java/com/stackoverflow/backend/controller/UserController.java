package com.stackoverflow.backend.controller;

import com.stackoverflow.backend.dto.BanUserRequest;
import com.stackoverflow.backend.dto.UpdateProfileRequest;
import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAll() {
        return userService.getAll();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Integer id) {
        return userService.getById(id);
    }

    @PatchMapping("/{id}/profile")
    public User updateProfile(@PathVariable Integer id, @RequestBody UpdateProfileRequest request) {
        return userService.updateProfile(id, request.getEmail(), request.getPhone());
    }

    @PostMapping("/{id}/ban")
    public User banUser(
            @PathVariable Integer id,
            @RequestParam Integer moderatorId,
            @RequestBody(required = false) BanUserRequest request) {
        String reason = request != null ? request.getReason() : null;
        return userService.banUser(id, moderatorId, reason);
    }

    @PostMapping("/{id}/unban")
    public User unbanUser(
            @PathVariable Integer id,
            @RequestParam Integer moderatorId) {
        return userService.unbanUser(id, moderatorId);
    }
}
