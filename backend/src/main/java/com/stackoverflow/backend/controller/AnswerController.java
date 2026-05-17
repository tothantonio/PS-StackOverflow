package com.stackoverflow.backend.controller;

import com.stackoverflow.backend.dto.AnswerDTO;
import com.stackoverflow.backend.entity.Answer;
import com.stackoverflow.backend.services.AnswerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/answers")
@CrossOrigin(origins = "*")
public class AnswerController {

    @Autowired
    private AnswerService answerService;

    @GetMapping
    public List<AnswerDTO> getByQuestion(@RequestParam Integer questionId) {
        return answerService.getDTOsByQuestion(questionId);
    }

    @PostMapping
    public AnswerDTO create(@RequestBody Answer answer, @RequestParam Integer questionId, @RequestParam Integer authorId) {
        Answer saved = answerService.create(answer, questionId, authorId);
        return answerService.toDTO(saved, questionId);
    }

    @PutMapping("/{id}")
    public AnswerDTO update(
            @PathVariable Integer id,
            @RequestBody Answer answer,
            @RequestParam Integer authorId,
            @RequestParam Integer questionId) {
        Answer updated = answerService.update(id, answer, authorId);
        return answerService.toDTO(updated, questionId);
    }

    @PostMapping("/{id}/accept")
    public AnswerDTO accept(
            @PathVariable Integer id,
            @RequestParam Integer authorId,
            @RequestParam Integer questionId) {
        return answerService.accept(id, authorId, questionId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, @RequestParam Integer authorId) {
        answerService.delete(id, authorId);
    }
}
