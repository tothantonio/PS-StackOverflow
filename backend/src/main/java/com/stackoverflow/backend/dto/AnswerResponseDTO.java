package com.stackoverflow.backend.dto;

import java.time.LocalDateTime;

public record AnswerResponseDTO(
        Integer id,
        String body,
        String imageUrl,
        String authorUsername,
        Double authorScore,
        LocalDateTime createdAt
) {
}
