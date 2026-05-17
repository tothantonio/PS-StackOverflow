package com.stackoverflow.backend;

import com.stackoverflow.backend.dto.AnswerDTO;
import com.stackoverflow.backend.entity.*;
import com.stackoverflow.backend.repository.AnswerRepository;
import com.stackoverflow.backend.repository.QuestionRepository;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.services.AnswerService;
import com.stackoverflow.backend.services.VoteService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnswerServiceTest {

    @Mock private AnswerRepository answerRepo;
    @Mock private QuestionRepository questionRepo;
    @Mock private UserRepository userRepo;
    @Mock private VoteService voteService;

    @InjectMocks private AnswerService answerService;

    private User buildUser(Integer id) {
        User u = new User();
        u.setId(id);
        return u;
    }

    private Question buildQuestion(Integer id) {
        Question q = new Question();
        q.setId(id);
        q.setStatus(QuestionStatus.RECEIVED);
        q.setAuthor(buildUser(99));
        return q;
    }

    private Answer buildAnswer(Integer id, Integer authorId) {
        Answer a = new Answer();
        a.setId(id);
        a.setAuthor(buildUser(authorId));
        a.setBody("Original Body");
        a.setAccepted(false);
        return a;
    }

    @Test
    void getDTOsByQuestion_ShouldReturnSortedAnswers() {
        Question q = buildQuestion(1);
        Answer answer = buildAnswer(1, 1);
        answer.setQuestion(q);

        when(questionRepo.findById(1)).thenReturn(Optional.of(q));
        when(answerRepo.findByQuestionOrderByCreatedAtAsc(q)).thenReturn(List.of(answer));
        when(voteService.getAnswerVoteCount(answer)).thenReturn(5);

        List<AnswerDTO> result = answerService.getDTOsByQuestion(1);

        assertEquals(1, result.size());
        assertEquals(5, result.get(0).getVoteCount());
    }

    @Test
    void create_ShouldSetInProgress_WhenFirstAnswer() {
        Answer answer = new Answer();
        answer.setBody("New answer");
        Question q = buildQuestion(1);

        when(questionRepo.findById(1)).thenReturn(Optional.of(q));
        when(userRepo.findById(1)).thenReturn(Optional.of(buildUser(1)));
        when(answerRepo.save(any(Answer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        answerService.create(answer, 1, 1);

        assertEquals(QuestionStatus.IN_PROGRESS, q.getStatus());
        verify(questionRepo).save(q);
    }

    @Test
    void create_ShouldThrow_WhenQuestionSolved() {
        Answer answer = new Answer();
        answer.setBody("New answer");
        Question q = buildQuestion(1);
        q.setStatus(QuestionStatus.SOLVED);

        when(questionRepo.findById(1)).thenReturn(Optional.of(q));

        assertThrows(RuntimeException.class, () -> answerService.create(answer, 1, 1));
    }

    @Test
    void accept_ShouldMarkSolved() {
        Question q = buildQuestion(1);
        q.setAuthor(buildUser(10));
        Answer answer = buildAnswer(3, 2);
        answer.setQuestion(q);

        when(answerRepo.findById(3)).thenReturn(Optional.of(answer));
        when(answerRepo.findByQuestionOrderByCreatedAtAsc(q)).thenReturn(List.of(answer));
        when(answerRepo.findById(3)).thenReturn(Optional.of(answer));
        when(voteService.getAnswerVoteCount(answer)).thenReturn(2);

        AnswerDTO result = answerService.accept(3, 10, 1);

        assertEquals(QuestionStatus.SOLVED, q.getStatus());
        assertTrue(result.getAccepted());
        verify(questionRepo).save(q);
    }

    @Test
    void update_ShouldThrow_WhenNotOwner() {
        Answer existing = buildAnswer(1, 1);
        when(answerRepo.findById(1)).thenReturn(Optional.of(existing));

        assertThrows(RuntimeException.class,
                () -> answerService.update(1, new Answer(), 2));
    }
}
