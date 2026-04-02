package com.stackoverflow.backend.repository;

import com.stackoverflow.backend.entity.Question;
import com.stackoverflow.backend.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends CrudRepository<Question, Integer> {
    List<Question> findAllByOrderByCreatedAtDesc();
//    List<Question> findByAuthorOrderByCreatedAt(User author);
//    List<Question> findByTitleContaining(String keyword);
}
