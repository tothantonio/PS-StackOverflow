package com.stackoverflow.backend.controller;

import com.stackoverflow.backend.entity.Answer;
import com.stackoverflow.backend.service.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/answers")
public class AnswerController{

    @Autowired
    private AnswerService answerService;

    @GetMapping("/question")
    public Iterable<Answer> getByQuestion(@RequestParam Integer questionId) {
        return answerService.getByQuestion(questionId);
    }

    @PostMapping
    public Answer create(@RequestBody Answer answer, @RequestParam Integer questionId, @RequestParam Integer authorId) {
        return answerService.create(answer, questionId, authorId);
    }

    @PutMapping("/{id}")
    public Answer update(@PathVariable Integer id, @RequestBody Answer answer, @RequestParam Integer authorId) {
        return answerService.update(id, answer, authorId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam Integer authorId) {
        answerService.delete(id, authorId);
    }

}
