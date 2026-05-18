package com.stackoverflow.backend.repository;

import com.stackoverflow.backend.entity.Answer;
import com.stackoverflow.backend.entity.Question;
import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.entity.Vote;
import com.stackoverflow.backend.entity.VoteType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VoteRepository extends CrudRepository<Vote, Long> {
    Optional<Vote> findByUserAndQuestion(User user, Question question);
    Optional<Vote> findByUserAndAnswer(User user, Answer answer);
    long countByQuestionAndType(Question question, VoteType type);
    long countByAnswerAndType(Answer answer, VoteType type);
}
