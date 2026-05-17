package com.stackoverflow.backend.controller;

import com.stackoverflow.backend.entity.Question;
import com.stackoverflow.backend.services.QuestionService;
import com.stackoverflow.backend.services.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private VoteService voteService;

    @GetMapping
    public List<Question> getAll() {
        return enrichAll(questionService.getAll());
    }

    @GetMapping("/{id}")
    public Question getById(@PathVariable Integer id) {
        return enrich(questionService.getById(id));
    }

    @GetMapping("/author/{authorId}")
    public List<Question> getByAuthor(@PathVariable Integer authorId) {
        return enrichAll(questionService.getByAuthor(authorId));
    }

    @GetMapping("/search")
    public List<Question> search(@RequestParam(required = false) String keyword) {
        return enrichAll(questionService.searchByTitle(keyword));
    }

    @GetMapping("/filter/tag")
    public List<Question> filterByTag(@RequestParam String tagName) {
        return enrichAll(questionService.filterByTag(tagName));
    }

    @GetMapping("/filter/tags")
    public List<Question> filterByTags(@RequestParam List<String> tagNames) {
        return enrichAll(questionService.filterByTags(tagNames));
    }

    @PostMapping
    public Question create(@RequestBody Question question, @RequestParam Integer authorId, @RequestParam String tagNames) {
        List<String> tags = Arrays.asList(tagNames.split(","));
        return enrich(questionService.create(question, authorId, tags));
    }

    @PutMapping("/{id}")
    public Question update(@PathVariable Integer id, @RequestParam Integer authorId, @RequestBody Question question, @RequestParam String tagNames) {
        List<String> tags = Arrays.asList(tagNames.split(","));
        return enrich(questionService.update(id, question, authorId, tags));
    }

    private Question enrich(Question question) {
        question.setVoteCount(voteService.getQuestionVoteCount(question));
        return question;
    }

    private List<Question> enrichAll(List<Question> questions) {
        questions.forEach(this::enrich);
        return questions;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam Integer authorId) {
        questionService.delete(id, authorId);
    }
}
