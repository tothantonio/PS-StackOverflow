package com.stackoverflow.backend;

import com.stackoverflow.backend.dto.*;
import com.stackoverflow.backend.entity.*;
import com.stackoverflow.backend.repository.AnswerRepository;
import com.stackoverflow.backend.repository.QuestionRepository;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.repository.VoteRepository;
import com.stackoverflow.backend.services.UserService;
import com.stackoverflow.backend.services.VoteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VoteServiceTest {

    @Mock private VoteRepository voteRepository;
    @Mock private QuestionRepository questionRepository;
    @Mock private AnswerRepository answerRepository;
    @Mock private UserRepository userRepository;
    @Mock private UserService userService;

    @InjectMocks private VoteService voteService;

    private User voter;
    private User author;

    @BeforeEach
    void setUp() {
        lenient().doNothing().when(userService).assertNotBanned(any());
        voter = new User();
        voter.setId(1);
        voter.setScore(0.0);

        author = new User();
        author.setId(2);
        author.setScore(0.0);
    }

    @Test
    void voteQuestion_ShouldThrow_WhenVotingOwnQuestion() {
        Question question = new Question();
        question.setId(5);
        question.setAuthor(voter);

        when(userRepository.findById(1)).thenReturn(Optional.of(voter));
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

    @Test
    void voteQuestion_NewUpvote_AddsAuthorPoints() {
        Question question = questionWithAuthor();
        when(userRepository.findById(1)).thenReturn(Optional.of(voter));
        when(questionRepository.findById(5)).thenReturn(Optional.of(question));
        when(voteRepository.findByUserAndQuestion(voter, question)).thenReturn(Optional.empty());
        when(voteRepository.countByQuestionAndType(question, VoteType.UPVOTE)).thenReturn(1L);
        when(voteRepository.countByQuestionAndType(question, VoteType.DOWNVOTE)).thenReturn(0L);

        VoteResponse response = voteService.voteQuestion(1, 5, 1);

        assertEquals(VoteService.QUESTION_UPVOTE_POINTS, author.getScore());
        assertEquals(VoteService.QUESTION_UPVOTE_POINTS, response.getAuthorScore());
        assertNull(response.getVoterScore());
        verify(userRepository).save(author);
    }

    @Test
    void voteQuestion_NewDownvote_SubtractsAuthorPoints() {
        Question question = questionWithAuthor();
        when(userRepository.findById(1)).thenReturn(Optional.of(voter));
        when(questionRepository.findById(5)).thenReturn(Optional.of(question));
        when(voteRepository.findByUserAndQuestion(voter, question)).thenReturn(Optional.empty());
        when(voteRepository.countByQuestionAndType(question, VoteType.UPVOTE)).thenReturn(0L);
        when(voteRepository.countByQuestionAndType(question, VoteType.DOWNVOTE)).thenReturn(1L);

        voteService.voteQuestion(1, 5, -1);

        assertEquals(-VoteService.QUESTION_DOWNVOTE_POINTS, author.getScore());
    }

    @Test
    void voteAnswer_NewUpvote_AddsAuthorPoints() {
        Answer answer = answerWithAuthor();
        when(userRepository.findById(1)).thenReturn(Optional.of(voter));
        when(answerRepository.findById(2)).thenReturn(Optional.of(answer));
        when(voteRepository.findByUserAndAnswer(voter, answer)).thenReturn(Optional.empty());
        when(voteRepository.countByAnswerAndType(answer, VoteType.UPVOTE)).thenReturn(1L);
        when(voteRepository.countByAnswerAndType(answer, VoteType.DOWNVOTE)).thenReturn(0L);

        VoteResponse response = voteService.voteAnswer(1, 2, 1);

        assertEquals(VoteService.ANSWER_UPVOTE_POINTS, author.getScore());
        assertEquals(VoteService.ANSWER_UPVOTE_POINTS, response.getAuthorScore());
        assertNull(response.getVoterScore());
    }

    @Test
    void voteAnswer_NewDownvote_SubtractsAuthorAndVoterPoints() {
        Answer answer = answerWithAuthor();
        when(userRepository.findById(1)).thenReturn(Optional.of(voter));
        when(answerRepository.findById(2)).thenReturn(Optional.of(answer));
        when(voteRepository.findByUserAndAnswer(voter, answer)).thenReturn(Optional.empty());
        when(voteRepository.countByAnswerAndType(answer, VoteType.UPVOTE)).thenReturn(0L);
        when(voteRepository.countByAnswerAndType(answer, VoteType.DOWNVOTE)).thenReturn(1L);

        VoteResponse response = voteService.voteAnswer(1, 2, -1);

        assertEquals(-VoteService.ANSWER_DOWNVOTE_POINTS, author.getScore());
        assertEquals(-VoteService.VOTER_ANSWER_DOWNVOTE_PENALTY, voter.getScore());
        assertEquals(-VoteService.VOTER_ANSWER_DOWNVOTE_PENALTY, response.getVoterScore());
        verify(userRepository).save(author);
        verify(userRepository).save(voter);
    }

    @Test
    void voteAnswer_RemoveDownvote_RestoresAuthorAndVoterPoints() {
        Answer answer = answerWithAuthor();
        author.setScore(-VoteService.ANSWER_DOWNVOTE_POINTS);
        voter.setScore(-VoteService.VOTER_ANSWER_DOWNVOTE_PENALTY);

        Vote existingVote = new Vote();
        existingVote.setType(VoteType.DOWNVOTE);

        when(userRepository.findById(1)).thenReturn(Optional.of(voter));
        when(answerRepository.findById(2)).thenReturn(Optional.of(answer));
        when(voteRepository.findByUserAndAnswer(voter, answer)).thenReturn(Optional.of(existingVote));
        when(voteRepository.countByAnswerAndType(answer, VoteType.UPVOTE)).thenReturn(0L);
        when(voteRepository.countByAnswerAndType(answer, VoteType.DOWNVOTE)).thenReturn(0L);

        VoteResponse response = voteService.voteAnswer(1, 2, -1);

        assertEquals(0.0, author.getScore());
        assertEquals(0.0, voter.getScore());
        assertEquals(0.0, response.getVoterScore());
        verify(voteRepository).delete(existingVote);
    }

    @Test
    void voteQuestion_ToggleUpvoteOff_RevertsAuthorPoints() {
        Question question = questionWithAuthor();
        author.setScore(VoteService.QUESTION_UPVOTE_POINTS);

        Vote existingVote = new Vote();
        existingVote.setType(VoteType.UPVOTE);

        when(userRepository.findById(1)).thenReturn(Optional.of(voter));
        when(questionRepository.findById(5)).thenReturn(Optional.of(question));
        when(voteRepository.findByUserAndQuestion(voter, question)).thenReturn(Optional.of(existingVote));
        when(voteRepository.countByQuestionAndType(question, VoteType.UPVOTE)).thenReturn(0L);
        when(voteRepository.countByQuestionAndType(question, VoteType.DOWNVOTE)).thenReturn(0L);

        voteService.voteQuestion(1, 5, 1);

        assertEquals(0.0, author.getScore());
        verify(voteRepository).delete(existingVote);
    }

    @Test
    void voteAnswer_FlipUpvoteToDownvote_AppliesCombinedDeltas() {
        Answer answer = answerWithAuthor();
        author.setScore(VoteService.ANSWER_UPVOTE_POINTS);

        Vote existingVote = new Vote();
        existingVote.setType(VoteType.UPVOTE);

        when(userRepository.findById(1)).thenReturn(Optional.of(voter));
        when(answerRepository.findById(2)).thenReturn(Optional.of(answer));
        when(voteRepository.findByUserAndAnswer(voter, answer)).thenReturn(Optional.of(existingVote));
        when(voteRepository.countByAnswerAndType(answer, VoteType.UPVOTE)).thenReturn(0L);
        when(voteRepository.countByAnswerAndType(answer, VoteType.DOWNVOTE)).thenReturn(1L);

        voteService.voteAnswer(1, 2, -1);

        assertEquals(
                VoteService.ANSWER_UPVOTE_POINTS
                        - VoteService.ANSWER_UPVOTE_POINTS
                        - VoteService.ANSWER_DOWNVOTE_POINTS,
                author.getScore()
        );
        assertEquals(-VoteService.VOTER_ANSWER_DOWNVOTE_PENALTY, voter.getScore());
        verify(voteRepository).save(existingVote);
    }

    @Test
    void voteQuestion_SavesVoteOnCreate() {
        Question question = questionWithAuthor();
        when(userRepository.findById(1)).thenReturn(Optional.of(voter));
        when(questionRepository.findById(5)).thenReturn(Optional.of(question));
        when(voteRepository.findByUserAndQuestion(voter, question)).thenReturn(Optional.empty());
        when(voteRepository.countByQuestionAndType(question, VoteType.UPVOTE)).thenReturn(1L);
        when(voteRepository.countByQuestionAndType(question, VoteType.DOWNVOTE)).thenReturn(0L);

        voteService.voteQuestion(1, 5, 1);

        ArgumentCaptor<Vote> voteCaptor = ArgumentCaptor.forClass(Vote.class);
        verify(voteRepository).save(voteCaptor.capture());
        assertEquals(VoteType.UPVOTE, voteCaptor.getValue().getType());
        assertEquals(question, voteCaptor.getValue().getQuestion());
    }

    private Question questionWithAuthor() {
        Question question = new Question();
        question.setId(5);
        question.setAuthor(author);
        return question;
    }

    private Answer answerWithAuthor() {
        Answer answer = new Answer();
        answer.setId(2);
        answer.setAuthor(author);
        return answer;
    }
}
