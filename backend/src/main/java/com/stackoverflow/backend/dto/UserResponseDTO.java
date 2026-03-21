package com.stackoverflow.backend.dto;

import com.stackoverflow.backend.entity.UserRole;

import java.time.LocalDateTime;

public record UserResponseDTO(
        Integer id,
        String username,
        String email,
        double score,
        UserRole role,
        LocalDateTime createdAt
) {}
