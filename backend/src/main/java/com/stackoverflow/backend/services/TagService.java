package com.stackoverflow.backend.services;

import com.stackoverflow.backend.entity.Tag;
import com.stackoverflow.backend.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    @Autowired
    private TagRepository tagRepository;

    public List<Tag> getAll() {
        return (List<Tag>) tagRepository.findAll();
    }

    public Tag create(Tag tag) {
        if (tagRepository.findByName(tag.getName()).isPresent()) {
            throw new RuntimeException("Tag already exists: " + tag.getName());
        }
        return tagRepository.save(tag);
    }
}
