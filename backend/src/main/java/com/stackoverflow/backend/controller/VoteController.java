package com.stackoverflow.backend.controller;

import com.stackoverflow.backend.dto.VoteResponse;
import com.stackoverflow.backend.services.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
@CrossOrigin(origins = "*")
public class VoteController {

    @Autowired
    private VoteService voteService;

    @PostMapping("/questions/{questionId}")
    public VoteResponse voteQuestion(
            @PathVariable Integer questionId,
            @RequestParam Integer userId,
            @RequestParam int direction) {
        int voteCount = voteService.voteQuestion(userId, questionId, direction);
        return new VoteResponse(voteCount);
    }

    @PostMapping("/answers/{answerId}")
    public VoteResponse voteAnswer(
            @PathVariable Integer answerId,
            @RequestParam Integer userId,
            @RequestParam int direction) {
        int voteCount = voteService.voteAnswer(userId, answerId, direction);
        return new VoteResponse(voteCount);
    }
}
