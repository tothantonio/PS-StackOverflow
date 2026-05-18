package com.stackoverflow.backend.services;

import com.stackoverflow.backend.dto.AnswerDTO;
import com.stackoverflow.backend.entity.Answer;
import com.stackoverflow.backend.entity.Question;
import com.stackoverflow.backend.entity.QuestionStatus;
import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.mapper.AnswerMapper;
import com.stackoverflow.backend.repository.AnswerRepository;
import com.stackoverflow.backend.repository.QuestionRepository;
import com.stackoverflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VoteService voteService;

    @Autowired
    private UserService userService;

    public List<AnswerDTO> getDTOsByQuestion(Integer questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        return answerRepository.findByQuestionOrderByCreatedAtAsc(question).stream()
                .sorted(Comparator.comparingInt((Answer answer) -> voteService.getAnswerVoteCount(answer)).reversed())
                .map(answer -> toDTO(answer, questionId))
                .toList();
    }

    public Answer create(Answer answer, Integer questionId, Integer authorId) {
        userService.assertNotBanned(authorId);
        validateBody(answer.getBody());

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (question.getStatus() == QuestionStatus.SOLVED) {
            throw new RuntimeException("Cannot add answers to a solved question");
        }

        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        answer.setQuestion(question);
        answer.setAuthor(author);
        answer.setBody(answer.getBody().trim());
        answer.setAccepted(false);
        Answer saved = answerRepository.save(answer);

        if (question.getStatus() == QuestionStatus.RECEIVED) {
            question.setStatus(QuestionStatus.IN_PROGRESS);
            questionRepository.save(question);
        }

        return saved;
    }

    public Answer update(Integer id, Answer updatedAnswer, Integer authorId) {
        validateBody(updatedAnswer.getBody());

        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        userService.assertCanModifyContent(authorId, answer.getAuthor().getId());

        answer.setBody(updatedAnswer.getBody().trim());
        answer.setImageUrl(updatedAnswer.getImageUrl());

        return answerRepository.save(answer);
    }

    public void delete(Integer id, Integer authorId) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        userService.assertCanModifyContent(authorId, answer.getAuthor().getId());

        answerRepository.delete(answer);
    }

    public AnswerDTO accept(Integer answerId, Integer questionAuthorId, Integer questionId) {
        Answer answer = answerRepository.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        Question question = answer.getQuestion();
        if (question == null || !question.getId().equals(questionId)) {
            throw new RuntimeException("Answer does not belong to this question");
        }

        if (!question.getAuthor().getId().equals(questionAuthorId)) {
            throw new RuntimeException("Only the question author can accept an answer");
        }

        if (question.getStatus() == QuestionStatus.SOLVED) {
            throw new RuntimeException("Question is already solved");
        }

        for (Answer existing : answerRepository.findByQuestionOrderByCreatedAtAsc(question)) {
            existing.setAccepted(existing.getId().equals(answerId));
            answerRepository.save(existing);
        }

        question.setStatus(QuestionStatus.SOLVED);
        questionRepository.save(question);

        return toDTO(answerRepository.findById(answerId).orElse(answer), questionId);
    }

    public AnswerDTO toDTO(Answer answer, Integer questionId) {
        return AnswerMapper.toDTO(
                answer,
                questionId,
                voteService.getAnswerVoteCount(answer),
                Boolean.TRUE.equals(answer.getAccepted())
        );
    }

    private void validateBody(String body) {
        if (body == null || body.isBlank()) {
            throw new RuntimeException("Answer text is required");
        }
    }
}
