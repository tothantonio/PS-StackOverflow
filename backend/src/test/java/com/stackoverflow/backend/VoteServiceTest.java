package com.stackoverflow.backend;

import com.stackoverflow.backend.entity.*;
import com.stackoverflow.backend.repository.AnswerRepository;
import com.stackoverflow.backend.repository.QuestionRepository;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.repository.VoteRepository;
import com.stackoverflow.backend.services.VoteService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VoteServiceTest {

    @Mock private VoteRepository voteRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private AnswerRepository answerRepository;
    @Mock private UserRepository userRepository;

    @InjectMocks private VoteService voteService;

    @Test
    void voteQuestion_ShouldThrow_WhenVotingOwnQuestion() {
        User user = new User();
        user.setId(1);

        Question question = new Question();
        question.setId(5);
        question.setAuthor(user);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(questionRepository.findById(5)).thenReturn(Optional.of(question));

        assertThrows(RuntimeException.class, () -> voteService.voteQuestion(1, 5, 1));
    }

    @Test
    void getQuestionVoteCount_ShouldReturnDifference() {
        Question question = new Question();
        question.setId(5);

        when(voteRepository.countByQuestionAndType(question, VoteType.UPVOTE)).thenReturn(4L);
        when(voteRepository.countByQuestionAndType(question, VoteType.DOWNVOTE)).thenReturn(1L);

        assertEquals(3, voteService.getQuestionVoteCount(question));
    }

    @Test
    void getAnswerVoteCount_CanBeNegative() {
        Answer answer = new Answer();
        answer.setId(2);

        when(voteRepository.countByAnswerAndType(answer, VoteType.UPVOTE)).thenReturn(1L);
        when(voteRepository.countByAnswerAndType(answer, VoteType.DOWNVOTE)).thenReturn(4L);

        assertEquals(-3, voteService.getAnswerVoteCount(answer));
    }
}
