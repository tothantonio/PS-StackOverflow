package com.stackoverflow.backend.repository;

import com.stackoverflow.backend.entity.Answer;
import com.stackoverflow.backend.entity.Question;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends CrudRepository<Answer, Integer> {
    List<Answer> findByQuestion(Question question);
}