package com.stackoverflow.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateQuestionDTO {
    private String title;
    private String body;
    private String imageUrl;
    private List<String> tags;
}
