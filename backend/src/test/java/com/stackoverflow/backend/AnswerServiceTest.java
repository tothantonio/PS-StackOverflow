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
class AnswerServiceTest {

    @Mock private AnswerRepository answerRepo;
    @Mock private QuestionRepository questionRepo;
    @Mock private UserRepository userRepo;

    @InjectMocks private AnswerService answerService;

    // helpers
    private User buildUser(Integer id) {
        User u = new User();
        u.setId(id);
        return u;
    }

    private Question buildQuestion(Integer id) {
        Question q = new Question();
        q.setId(id);
        return q;
    }

    private Answer buildAnswer(Integer id, Integer authorId) {
        Answer a = new Answer();
        a.setId(id);
        a.setAuthor(buildUser(authorId));
        a.setBody("Original Body");
        return a;
    }

    @Test
    void getByQuestion_ShouldReturnAnswers() {
        Question q = buildQuestion(1);

        when(questionRepo.findById(1)).thenReturn(Optional.of(q));
        when(answerRepo.findByQuestion(q))
                .thenReturn(List.of(buildAnswer(1, 1)));

        List<Answer> result = (List<Answer>) answerService.getByQuestion(1);

        assertEquals(1, result.size());
    }

    @Test
    void getByQuestion_ShouldThrow_WhenQuestionNotFound() {
        when(questionRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> answerService.getByQuestion(1));
    }

    @Test
    void create_ShouldSaveAnswer_WhenValid() {
        Answer answer = new Answer();

        when(questionRepo.findById(1)).thenReturn(Optional.of(buildQuestion(1)));
        when(userRepo.findById(1)).thenReturn(Optional.of(buildUser(1)));
        when(answerRepo.save(any(Answer.class))).thenReturn(answer);

        Answer result = answerService.create(answer, 1, 1);

        assertNotNull(result);
        verify(answerRepo).save(any(Answer.class));
    }

    @Test
    void create_ShouldThrow_WhenQuestionNotFound() {
        Answer answer = new Answer();
        when(questionRepo.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> answerService.create(answer, 99, 1));
    }

    @Test
    void create_ShouldThrow_WhenUserNotFound() {
        Answer answer = new Answer();

        when(questionRepo.findById(1)).thenReturn(Optional.of(buildQuestion(1)));
        when(userRepo.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> answerService.create(answer, 1, 99));
    }

    @Test
    void update_ShouldUpdate_WhenOwner() {
        Answer existing = buildAnswer(1, 1);
        Answer update = new Answer();
        update.setBody("Updated");

        when(answerRepo.findById(1)).thenReturn(Optional.of(existing));
        when(answerRepo.save(any(Answer.class))).thenReturn(existing);

        Answer result = answerService.update(1, update, 1);

        assertEquals("Updated", result.getBody());
    }

    @Test
    void update_ShouldThrow_WhenNotOwner() {
        Answer existing = buildAnswer(1, 1);
        when(answerRepo.findById(1)).thenReturn(Optional.of(existing));

        assertThrows(RuntimeException.class,
                () -> answerService.update(1, new Answer(), 2));
    }

    @Test
    void delete_ShouldDelete_WhenOwner() {
        Answer existing = buildAnswer(1, 1);
        when(answerRepo.findById(1)).thenReturn(Optional.of(existing));

        answerService.delete(1, 1);

        verify(answerRepo).delete(existing);
    }

    @Test
    void delete_ShouldThrow_WhenNotOwner() {
        Answer existing = buildAnswer(1, 1);
        when(answerRepo.findById(1)).thenReturn(Optional.of(existing));

        assertThrows(RuntimeException.class,
                () -> answerService.delete(1, 2));
    }
}