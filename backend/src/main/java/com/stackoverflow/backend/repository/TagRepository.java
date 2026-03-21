package com.stackoverflow.backend.repository;

import com.stackoverflow.backend.entity.Tag;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagRepository extends CrudRepository<Tag, Integer> {
    Optional<Tag> findByName(String name);
    boolean existsByName(String name);
}