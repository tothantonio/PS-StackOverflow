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
public class QuestionServiceTest {

    @Mock private QuestionRepository questionRepo;
    @Mock private UserRepository userRepo;
    @Mock private TagRepository tagRepo;
    @InjectMocks private QuestionService questionService;

    private User mockUser(Integer id) { User u = new User(); u.setId(id); return u; }
    private Question mockQuestion(Integer id, Integer authorId) {
        Question q = new Question(); q.setId(id); q.setAuthor(mockUser(authorId)); q.setQuestionTags(new ArrayList<>()); return q;
    }

    @Test
    void testGetAll() {
        when(questionRepo.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(mockQuestion(1, 1)));
        assertEquals(1, ((List<Question>) questionService.getAll()).size());
    }

    @Test
    void testGetById() {
        when(questionRepo.findById(1)).thenReturn(Optional.of(mockQuestion(1, 1)));
        assertNotNull(questionService.getById(1));

        when(questionRepo.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> questionService.getById(99));
    }

    @Test
    void testCreate() {
        Question q = mockQuestion(1, 1);
        when(userRepo.findById(1)).thenReturn(Optional.of(mockUser(1)));
        when(tagRepo.findByName("java")).thenReturn(Optional.empty());
        when(tagRepo.save(any(Tag.class))).thenReturn(new Tag());
        when(questionRepo.save(any(Question.class))).thenReturn(q);

        Question res = questionService.create(q, 1, List.of("java"));
        assertEquals(QuestionStatus.RECEIVED, res.getStatus());
        verify(questionRepo).save(q);

        when(userRepo.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> questionService.create(q, 99, null));
    }

    @Test
    void testUpdate() {
        Question existing = mockQuestion(1, 1);
        Question updateData = mockQuestion(1, 1); updateData.setTitle("New Title");

        when(questionRepo.findById(1)).thenReturn(Optional.of(existing));
        when(questionRepo.save(any(Question.class))).thenReturn(existing);

        Question res = questionService.update(1, updateData, 1, List.of());
        assertEquals("New Title", res.getTitle());

        assertThrows(RuntimeException.class, () -> questionService.update(1, updateData, 2, List.of()));

        when(questionRepo.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> questionService.update(99, updateData, 1, List.of()));
    }

    @Test
    void testDelete() {
        when(questionRepo.findById(1)).thenReturn(Optional.of(mockQuestion(1, 1)));
        questionService.delete(1, 1);
        verify(questionRepo).delete(any(Question.class));

        assertThrows(RuntimeException.class, () -> questionService.delete(1, 2));

        when(questionRepo.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> questionService.delete(99, 1));
    }
}