package com.stackoverflow.backend.dto;

import com.stackoverflow.backend.entity.QuestionStatus;

import java.time.LocalDateTime;
import java.util.List;

public record QuestionResponseDTO(
        Integer id,
        String title,
        String body,
        String imageUrl,
        String authorUsername,
        double authorScore,
        QuestionStatus status,
        List<String> tags,
        LocalDateTime createdAt
) {}