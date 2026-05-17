package com.stackoverflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerDTO {
    private Integer id;
    private Integer questionId;
    private String body;
    private String imageUrl;
    private LocalDateTime createdAt;
    private Integer voteCount;
    private Boolean accepted;
    private UserDTO author;
}
