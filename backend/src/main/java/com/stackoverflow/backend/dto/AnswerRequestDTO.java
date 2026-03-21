package com.stackoverflow.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record AnswerRequestDTO(
        @NotBlank String body,
        String imageUrl
) {
}
