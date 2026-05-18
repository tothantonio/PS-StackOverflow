package com.stackoverflow.backend.services;

import com.stackoverflow.backend.dto.*;
import com.stackoverflow.backend.entity.*;
import com.stackoverflow.backend.repository.AnswerRepository;
import com.stackoverflow.backend.repository.QuestionRepository;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class VoteService {

    public static final double QUESTION_UPVOTE_POINTS = 2.5;
    public static final double QUESTION_DOWNVOTE_POINTS = 1.5;
    public static final double ANSWER_UPVOTE_POINTS = 5.0;
    public static final double ANSWER_DOWNVOTE_POINTS = 2.5;
    public static final double VOTER_ANSWER_DOWNVOTE_PENALTY = 1.5;

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private UserRepository userRepository;

    public VoteResponse voteQuestion(Integer userId, Integer questionId, int direction) {
        if (direction != 1 && direction != -1) {
            throw new RuntimeException("Vote direction must be 1 or -1");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (question.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("You cannot vote on your own question");
        }

        VoteType newType = direction > 0 ? VoteType.UPVOTE : VoteType.DOWNVOTE;
        applyVote(user, question, null, newType);

        User author = question.getAuthor();
        return new VoteResponse(getQuestionVoteCount(question), getScore(author), null);
    }

    public VoteResponse voteAnswer(Integer userId, Integer answerId, int direction) {
        if (direction != 1 && direction != -1) {
            throw new RuntimeException("Vote direction must be 1 or -1");
        }

        User voter = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (answer.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("You cannot vote on your own answer");
        }

        VoteType newType = direction > 0 ? VoteType.UPVOTE : VoteType.DOWNVOTE;
        boolean voterScoreAffected = applyVote(voter, null, answer, newType);

        User author = answer.getAuthor();
        Double voterScore = voterScoreAffected ? getScore(voter) : null;
        return new VoteResponse(getAnswerVoteCount(answer), getScore(author), voterScore);
    }

    private boolean applyVote(User voter, Question question, Answer answer, VoteType newType) {
        if (question != null) {
            User author = question.getAuthor();
            var existing = voteRepository.findByUserAndQuestion(voter, question);
            if (existing.isPresent()) {
                Vote vote = existing.get();
                VoteType oldType = vote.getType();
                if (vote.getType() == newType) {
                    revertQuestionVote(author, oldType);
                    voteRepository.delete(vote);
                } else {
                    revertQuestionVote(author, oldType);
                    applyQuestionVote(author, newType);
                    vote.setType(newType);
                    voteRepository.save(vote);
                }
            } else {
                applyQuestionVote(author, newType);
                voteRepository.save(new Vote(null, voter, question, null, newType));
            }
            return false;
        }

        User author = answer.getAuthor();
        boolean voterScoreAffected = false;
        var existing = voteRepository.findByUserAndAnswer(voter, answer);
        if (existing.isPresent()) {
            Vote vote = existing.get();
            VoteType oldType = vote.getType();
            if (vote.getType() == newType) {
                if (oldType == VoteType.DOWNVOTE) {
                    voterScoreAffected = true;
                }
                revertAnswerVote(author, voter, oldType);
                voteRepository.delete(vote);
            } else {
                if (oldType == VoteType.DOWNVOTE || newType == VoteType.DOWNVOTE) {
                    voterScoreAffected = true;
                }
                revertAnswerVote(author, voter, oldType);
                applyAnswerVote(author, voter, newType);
                vote.setType(newType);
                voteRepository.save(vote);
            }
        } else {
            if (newType == VoteType.DOWNVOTE) {
                voterScoreAffected = true;
            }
            applyAnswerVote(author, voter, newType);
            voteRepository.save(new Vote(null, voter, null, answer, newType));
        }
        return voterScoreAffected;
    }

    private void applyQuestionVote(User author, VoteType type) {
        if (type == VoteType.UPVOTE) {
            adjustScore(author, QUESTION_UPVOTE_POINTS);
        } else {
            adjustScore(author, -QUESTION_DOWNVOTE_POINTS);
        }
    }

    private void revertQuestionVote(User author, VoteType type) {
        if (type == VoteType.UPVOTE) {
            adjustScore(author, -QUESTION_UPVOTE_POINTS);
        } else {
            adjustScore(author, QUESTION_DOWNVOTE_POINTS);
        }
    }

    private void applyAnswerVote(User author, User voter, VoteType type) {
        if (type == VoteType.UPVOTE) {
            adjustScore(author, ANSWER_UPVOTE_POINTS);
        } else {
            adjustScore(author, -ANSWER_DOWNVOTE_POINTS);
            adjustScore(voter, -VOTER_ANSWER_DOWNVOTE_PENALTY);
        }
    }

    private void revertAnswerVote(User author, User voter, VoteType type) {
        if (type == VoteType.UPVOTE) {
            adjustScore(author, -ANSWER_UPVOTE_POINTS);
        } else {
            adjustScore(author, ANSWER_DOWNVOTE_POINTS);
            adjustScore(voter, VOTER_ANSWER_DOWNVOTE_PENALTY);
        }
    }

    private void adjustScore(User user, double delta) {
        if (user == null || delta == 0.0) {
            return;
        }
        double current = user.getScore() != null ? user.getScore() : 0.0;
        user.setScore(current + delta);
        userRepository.save(user);
    }

    private double getScore(User user) {
        return user.getScore() != null ? user.getScore() : 0.0;
    }

    public int getQuestionVoteCount(Question question) {
        long upvotes = voteRepository.countByQuestionAndType(question, VoteType.UPVOTE);
        long downvotes = voteRepository.countByQuestionAndType(question, VoteType.DOWNVOTE);
        return (int) (upvotes - downvotes);
    }

    public int getAnswerVoteCount(Answer answer) {
        long upvotes = voteRepository.countByAnswerAndType(answer, VoteType.UPVOTE);
        long downvotes = voteRepository.countByAnswerAndType(answer, VoteType.DOWNVOTE);
        return (int) (upvotes - downvotes);
    }
}
