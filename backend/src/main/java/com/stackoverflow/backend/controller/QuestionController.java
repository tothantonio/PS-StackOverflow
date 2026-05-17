package com.stackoverflow.backend.controller;

import com.stackoverflow.backend.entity.Question;
import com.stackoverflow.backend.services.QuestionService;
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

    @GetMapping
    public List<Question> getAll() {
        return questionService.getAll();
    }

    @GetMapping("/{id}")
    public Question getById(@PathVariable Integer id) {
        return questionService.getById(id);
    }

    @GetMapping("/author/{authorId}")
    public List<Question> getByAuthor(@PathVariable Integer authorId) {
        return questionService.getByAuthor(authorId);
    }

    @GetMapping("/search")
    public List<Question> search(@RequestParam(required = false) String keyword) {
        return questionService.searchByTitle(keyword);
    }

    @GetMapping("/filter/tag")
    public List<Question> filterByTag(@RequestParam String tagName) {
        return questionService.filterByTag(tagName);
    }

    @GetMapping("/filter/tags")
    public List<Question> filterByTags(@RequestParam List<String> tagNames) {
        return questionService.filterByTags(tagNames);
    }

    @PostMapping
    public Question create(@RequestBody Question question, @RequestParam Integer authorId, @RequestParam String tagNames) {
        List<String> tags = Arrays.asList(tagNames.split(","));
        return questionService.create(question, authorId, tags);
    }

    @PutMapping("/{id}")
    public Question update(@PathVariable Integer id, @RequestParam Integer authorId, @RequestBody Question question, @RequestParam String tagNames) {
        List<String> tags = Arrays.asList(tagNames.split(","));
        return questionService.update(id, question, authorId, tags);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam Integer authorId) {
        questionService.delete(id, authorId);
    }
}
