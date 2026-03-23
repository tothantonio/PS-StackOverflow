package com.stackoverflow.backend.controller;

import com.stackoverflow.backend.entity.Question;
import com.stackoverflow.backend.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public Iterable<Question> getAll() {
        return questionService.getAll();
    }

    @GetMapping("/{id}")
    public Question getById(@PathVariable Integer id) {
        return questionService.getById(id);
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
