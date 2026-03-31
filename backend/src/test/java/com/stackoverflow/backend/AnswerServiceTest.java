package com.stackoverflow.backend;

import com.stackoverflow.backend.entity.Answer;
import com.stackoverflow.backend.entity.Question;
import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.repository.AnswerRepository;
import com.stackoverflow.backend.repository.QuestionRepository;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.service.AnswerService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class AnswerServiceTest {

    @Mock private AnswerRepository answerRepo;
    @Mock private QuestionRepository questionRepo;
    @Mock private UserRepository userRepo;
    @InjectMocks private AnswerService answerService;

    private User mockUser(Integer id) { User u = new User(); u.setId(id); return u; }
    private Question mockQuestion(Integer id) { Question q = new Question(); q.setId(id); return q; }
    private Answer mockAnswer(Integer id, Integer authorId) {
        Answer a = new Answer(); a.setId(id); a.setAuthor(mockUser(authorId)); a.setBody("Original Body"); return a;
    }

    @Test
    void testGetByQuestion() {
        Question q = mockQuestion(1);
        when(questionRepo.findById(1)).thenReturn(Optional.of(q));
        when(answerRepo.findByQuestion(q)).thenReturn(List.of(mockAnswer(1, 1)));

        assertEquals(1, ((List<Answer>) answerService.getByQuestion(1)).size());

        when(questionRepo.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> answerService.getByQuestion(99));
    }

    @Test
    void testCreate() {
        Answer newAnswer = new Answer();
        when(questionRepo.findById(1)).thenReturn(Optional.of(mockQuestion(1)));
        when(userRepo.findById(1)).thenReturn(Optional.of(mockUser(1)));
        when(answerRepo.save(any(Answer.class))).thenReturn(newAnswer);

        assertNotNull(answerService.create(newAnswer, 1, 1));
        verify(answerRepo).save(newAnswer);

        when(questionRepo.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> answerService.create(newAnswer, 99, 1), "Question not found");

        when(questionRepo.findById(1)).thenReturn(Optional.of(mockQuestion(1)));
        when(userRepo.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> answerService.create(newAnswer, 1, 99), "Author not found");
    }

    @Test
    void testUpdate() {
        Answer existing = mockAnswer(1, 1);
        Answer updateData = new Answer(); updateData.setBody("Updated Body");

        when(answerRepo.findById(1)).thenReturn(Optional.of(existing));
        when(answerRepo.save(any(Answer.class))).thenReturn(existing);

        Answer res = answerService.update(1, updateData, 1);
        assertEquals("Updated Body", res.getBody());

        assertThrows(RuntimeException.class, () -> answerService.update(1, updateData, 2));

        when(answerRepo.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> answerService.update(99, updateData, 1));
    }

    @Test
    void testDelete() {
        Answer existing = mockAnswer(1, 1);
        when(answerRepo.findById(1)).thenReturn(Optional.of(existing));

        answerService.delete(1, 1);
        verify(answerRepo).delete(existing);

        assertThrows(RuntimeException.class, () -> answerService.delete(1, 2));

        when(answerRepo.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> answerService.delete(99, 1));
    }
}