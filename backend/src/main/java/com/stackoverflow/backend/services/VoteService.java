package com.stackoverflow.backend.services;

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

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private UserRepository userRepository;

    public int voteQuestion(Integer userId, Integer questionId, int direction) {
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
        return getQuestionVoteCount(question);
    }

    public int voteAnswer(Integer userId, Integer answerId, int direction) {
        if (direction != 1 && direction != -1) {
            throw new RuntimeException("Vote direction must be 1 or -1");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (answer.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("You cannot vote on your own answer");
        }

        VoteType newType = direction > 0 ? VoteType.UPVOTE : VoteType.DOWNVOTE;
        applyVote(user, null, answer, newType);
        return getAnswerVoteCount(answer);
    }

    private void applyVote(User user, Question question, Answer answer, VoteType newType) {
        if (question != null) {
            var existing = voteRepository.findByUserAndQuestion(user, question);
            if (existing.isPresent()) {
                Vote vote = existing.get();
                if (vote.getType() == newType) {
                    voteRepository.delete(vote);
                } else {
                    vote.setType(newType);
                    voteRepository.save(vote);
                }
            } else {
                voteRepository.save(new Vote(null, user, question, null, newType));
            }
            return;
        }

        var existing = voteRepository.findByUserAndAnswer(user, answer);
        if (existing.isPresent()) {
            Vote vote = existing.get();
            if (vote.getType() == newType) {
                voteRepository.delete(vote);
            } else {
                vote.setType(newType);
                voteRepository.save(vote);
            }
        } else {
            voteRepository.save(new Vote(null, user, null, answer, newType));
        }
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
