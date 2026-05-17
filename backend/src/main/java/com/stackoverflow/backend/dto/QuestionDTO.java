package com.stackoverflow.backend.dto;

import com.stackoverflow.backend.entity.QuestionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
    private Integer id;
    private String title;
    private String body;
    private String imageUrl;
    private LocalDateTime createdAt;
    private QuestionStatus status;
    private Integer voteCount;
    private UserDTO author;
    private List<String> tags;
    private Integer answerCount;
}
