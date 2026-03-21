package com.stackoverflow.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record QuestionRequestDTO(
        @NotBlank String title,
        @NotBlank String body,
        String imageUrl,
        @NotEmpty List<String> tags
) {}