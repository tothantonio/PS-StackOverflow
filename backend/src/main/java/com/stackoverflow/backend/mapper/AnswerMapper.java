package com.stackoverflow.backend.mapper;

import com.stackoverflow.backend.dto.*;
import com.stackoverflow.backend.entity.Answer;
import com.stackoverflow.backend.entity.User;

public final class AnswerMapper {

    private AnswerMapper() {
    }

    public static UserDTO toUserDTO(User user) {
        if (user == null) {
            return null;
        }
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getScore(),
                user.getRole()
        );
    }

    public static AnswerDTO toDTO(Answer answer, Integer questionId, int voteCount, boolean accepted) {
        AnswerDTO dto = new AnswerDTO();
        dto.setId(answer.getId());
        dto.setQuestionId(questionId != null
                ? questionId
                : (answer.getQuestion() != null ? answer.getQuestion().getId() : null));
        dto.setBody(answer.getBody());
        dto.setImageUrl(answer.getImageUrl());
        dto.setCreatedAt(answer.getCreatedAt());
        dto.setVoteCount(voteCount);
        dto.setAccepted(accepted);
        dto.setAuthor(toUserDTO(answer.getAuthor()));
        return dto;
    }
}
