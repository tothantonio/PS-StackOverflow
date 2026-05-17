package com.stackoverflow.backend;

import com.stackoverflow.backend.dto.AnswerDTO;
import com.stackoverflow.backend.entity.Answer;
import com.stackoverflow.backend.entity.Question;
import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.entity.UserRole;
import com.stackoverflow.backend.mapper.AnswerMapper;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class AnswerMapperTest {

    @Test
    void toDTO_ShouldMapFieldsWithoutPassword() {
        User author = new User();
        author.setId(2);
        author.setUsername("maria");
        author.setEmail("maria@example.com");
        author.setPassword("secret");
        author.setRole(UserRole.USER);

        Question question = new Question();
        question.setId(5);

        Answer answer = new Answer();
        answer.setId(7);
        answer.setQuestion(question);
        answer.setAuthor(author);
        answer.setBody("Answer text");
        answer.setImageUrl("data:image/png;base64,abc");
        answer.setCreatedAt(LocalDateTime.of(2026, 5, 15, 10, 0));

        AnswerDTO dto = AnswerMapper.toDTO(answer, 5, 3, true);

        assertEquals(7, dto.getId());
        assertEquals(5, dto.getQuestionId());
        assertEquals("Answer text", dto.getBody());
        assertEquals("data:image/png;base64,abc", dto.getImageUrl());
        assertEquals(3, dto.getVoteCount());
        assertTrue(dto.getAccepted());
        assertEquals("maria", dto.getAuthor().getUsername());
        assertEquals("maria@example.com", dto.getAuthor().getEmail());
    }
}
