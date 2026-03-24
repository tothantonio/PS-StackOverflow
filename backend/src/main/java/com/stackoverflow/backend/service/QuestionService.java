package com.stackoverflow.backend.service;

import com.stackoverflow.backend.entity.*;
import com.stackoverflow.backend.repository.QuestionRepository;
import com.stackoverflow.backend.repository.TagRepository;
import com.stackoverflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    public Iterable<Question> getAll() {
        return questionRepository.findAllByOrderByCreatedAtDesc();
    }

    public Question getById(Integer id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public Question create(Question question, Integer authorId, List<String> tagNames) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        question.setAuthor(author);
        question.setStatus(QuestionStatus.RECEIVED);

        saveTags(tagNames, question);
        return questionRepository.save(question);
    }

    public Question update(Integer id, Question updatedQuestion, Integer authorId, List<String> tagNames) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getAuthor().getId().equals(authorId)) {
            throw new RuntimeException("Only the author can edit this question");
        }

        question.setTitle(updatedQuestion.getTitle());
        question.setBody(updatedQuestion.getBody());
        question.setImageUrl(updatedQuestion.getImageUrl());

        question.getQuestionTags().clear();

        saveTags(tagNames, question);
        return questionRepository.save(question);
    }

    public void delete(Integer id, Integer authorId) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getAuthor().getId().equals(authorId)) {
            throw new RuntimeException("Only the author can delete this question");
        }
        questionRepository.delete(question);
    }

    public void saveTags(List<String> tagNames, Question question) {
        if (tagNames == null) return;

        if (question.getQuestionTags() == null) {
            question.setQuestionTags(new ArrayList<>());
        }

        for (String tagName : tagNames) {
            Tag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> {
                        Tag newTag = new Tag();
                        newTag.setName(tagName);
                        return tagRepository.save(newTag);
                    });

            QuestionTag questionTag = new QuestionTag();
            questionTag.setQuestion(question);
            questionTag.setTag(tag);

            question.getQuestionTags().add(questionTag);
        }
    }
}
