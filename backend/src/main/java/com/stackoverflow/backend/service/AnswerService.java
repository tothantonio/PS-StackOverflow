package com.stackoverflow.backend.service;

import com.stackoverflow.backend.entity.Answer;
import com.stackoverflow.backend.entity.Question;
import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.repository.AnswerRepository;
import com.stackoverflow.backend.repository.QuestionRepository;
import com.stackoverflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnswerService {

    @Autowired
    private AnswerRepository answerRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Answer> getByQuestion(Integer questionId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        return answerRepository.findByQuestion(question);
    }

    public Answer create(Answer answer, Integer questionId, Integer authorId) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        answer.setQuestion(question);
        answer.setAuthor(author);
        return answerRepository.save(answer);
    }

    public Answer update(Integer id, Answer updatedAnswer, Integer authorId) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (!answer.getAuthor().getId().equals(authorId))
            throw new RuntimeException("Only the author can edit this answer");

        answer.setBody(updatedAnswer.getBody());
        answer.setImageUrl(updatedAnswer.getImageUrl());

        return answerRepository.save(answer);
    }

    public void delete(Integer id, Integer authorId) {
        Answer answer = answerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        if (!answer.getAuthor().getId().equals(authorId))
            throw new RuntimeException("Only the author can delete this answer");

        answerRepository.delete(answer);
    }
}
