package com.stackoverflow.backend.repository;

import com.stackoverflow.backend.entity.*;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends CrudRepository<Vote, Integer> {
//    Optional<Vote> findByUserAndQuestion(User author, Question question);
//    Optional<Vote> findByUserAndAnswer(User user, Answer answer);
//    long countByQuestionAndType(Question question, VoteType type);
//    long countByAnswerAndType(Answer answer, VoteType type);
}
