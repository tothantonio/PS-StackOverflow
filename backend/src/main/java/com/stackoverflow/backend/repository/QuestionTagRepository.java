package com.stackoverflow.backend.repository;

import com.stackoverflow.backend.entity.Question;
import com.stackoverflow.backend.entity.QuestionTag;
import com.stackoverflow.backend.entity.Tag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionTagRepository extends CrudRepository<QuestionTag, Integer> {
    List<QuestionTag> findByQuestion(Question question);
    List<QuestionTag> findByTag(Tag tag);
    void deleteByQuestion(Question question);
}