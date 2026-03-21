package com.stackoverflow.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record UserRequestDTO(
        @NotBlank String username,
        @NotBlank String email,
        @NotBlank String password
) {}