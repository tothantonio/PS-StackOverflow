package com.stackoverflow.backend;

import com.stackoverflow.backend.entity.*;
import com.stackoverflow.backend.repository.QuestionRepository;
import com.stackoverflow.backend.repository.TagRepository;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.service.QuestionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class QuestionServiceTest {

    @Mock private QuestionRepository questionRepo;
    @Mock private UserRepository userRepo;
    @Mock private TagRepository tagRepo;

    @InjectMocks private QuestionService questionService;

    // helpers
    private User buildUser(Integer id) {
        User u = new User();
        u.setId(id);
        return u;
    }

    private Question buildQuestion(Integer id, Integer authorId) {
        Question q = new Question();
        q.setId(id);
        q.setAuthor(buildUser(authorId));
        q.setQuestionTags(new ArrayList<>());
        return q;
    }

    @Test
    void getAll_ShouldReturnQuestions() {
        when(questionRepo.findAllByOrderByCreatedAtDesc())
                .thenReturn(List.of(buildQuestion(1, 1)));

        List<Question> result = (List<Question>) questionService.getAll();

        assertEquals(1, result.size());
    }

    @Test
    void getById_ShouldReturnQuestion_WhenExists() {
        when(questionRepo.findById(1))
                .thenReturn(Optional.of(buildQuestion(1, 1)));

        Question result = questionService.getById(1);

        assertNotNull(result);
    }

    @Test
    void getById_ShouldThrow_WhenNotFound() {
        when(questionRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> questionService.getById(1));
    }

    @Test
    void create_ShouldSaveQuestion_WhenValid() {
        Question q = buildQuestion(1, 1);

        when(userRepo.findById(1)).thenReturn(Optional.of(buildUser(1)));
        when(tagRepo.findByName("java")).thenReturn(Optional.empty());
        when(tagRepo.save(any(Tag.class))).thenReturn(new Tag());
        when(questionRepo.save(any(Question.class))).thenReturn(q);

        Question result = questionService.create(q, 1, List.of("java"));

        assertEquals(QuestionStatus.RECEIVED, result.getStatus());
        verify(questionRepo).save(any(Question.class));
    }

    @Test
    void create_ShouldThrow_WhenUserNotFound() {
        Question q = buildQuestion(1, 1);
        when(userRepo.findById(99)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> questionService.create(q, 99, List.of()));
    }

    @Test
    void update_ShouldUpdate_WhenOwner() {
        Question existing = buildQuestion(1, 1);
        Question update = buildQuestion(1, 1);
        update.setTitle("New Title");

        when(questionRepo.findById(1)).thenReturn(Optional.of(existing));
        when(questionRepo.save(any(Question.class))).thenReturn(existing);

        Question result = questionService.update(1, update, 1, List.of());

        assertEquals("New Title", result.getTitle());
    }

    @Test
    void update_ShouldThrow_WhenNotOwner() {
        Question existing = buildQuestion(1, 1);
        Question update = buildQuestion(1, 1);

        when(questionRepo.findById(1)).thenReturn(Optional.of(existing));

        assertThrows(RuntimeException.class,
                () -> questionService.update(1, update, 2, List.of()));
    }

    @Test
    void delete_ShouldDelete_WhenOwner() {
        Question q = buildQuestion(1, 1);
        when(questionRepo.findById(1)).thenReturn(Optional.of(q));

        questionService.delete(1, 1);

        verify(questionRepo).delete(q);
    }

    @Test
    void delete_ShouldThrow_WhenNotOwner() {
        Question q = buildQuestion(1, 1);
        when(questionRepo.findById(1)).thenReturn(Optional.of(q));

        assertThrows(RuntimeException.class,
                () -> questionService.delete(1, 2));
    }
}