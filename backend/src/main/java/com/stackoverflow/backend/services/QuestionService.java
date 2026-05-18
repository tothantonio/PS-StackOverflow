package com.stackoverflow.backend.services;

import com.stackoverflow.backend.entity.*;
import com.stackoverflow.backend.repository.QuestionRepository;
import com.stackoverflow.backend.repository.QuestionTagRepository;
import com.stackoverflow.backend.repository.TagRepository;
import com.stackoverflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private QuestionTagRepository questionTagRepository;

    @Autowired
    private UserService userService;

    public List<Question> getAll() {
        return questionRepository.findAllByOrderByCreatedAtDesc();
    }

    public Question getById(Integer id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public List<Question> getByAuthor(Integer authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return questionRepository.findByAuthorOrderByCreatedAtDesc(author);
    }

    public List<Question> searchByTitle(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAll();
        }
        return questionRepository.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(keyword.trim());
    }

    public List<Question> filterByTag(String tagName) {
        Tag tag = tagRepository.findByName(tagName)
                .orElseThrow(() -> new RuntimeException("Tag not found: " + tagName));
        
        List<QuestionTag> questionTags = questionTagRepository.findByTag(tag);
        return questionTags.stream()
                .map(QuestionTag::getQuestion)
                .distinct()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public List<Question> filterByTags(List<String> tagNames) {
        if (tagNames == null || tagNames.isEmpty()) {
            return getAll();
        }

        Set<Question> questions = new HashSet<>();
        for (String tagName : tagNames) {
            try {
                questions.addAll(filterByTag(tagName));
            } catch (RuntimeException e) {
                // Tag not found, continue with other tags
            }
        }

        return questions.stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public Question create(Question question, Integer authorId, List<String> tagNames) {
        userService.assertNotBanned(authorId);
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

        userService.assertCanModifyContent(authorId, question.getAuthor().getId());

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

        userService.assertCanModifyContent(authorId, question.getAuthor().getId());
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
