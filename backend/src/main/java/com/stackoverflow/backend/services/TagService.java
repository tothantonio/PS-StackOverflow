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

    public Tag getById(Integer id) {
        return tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
    }

    public Tag getByName(String name) {
        return tagRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Tag not found: " + name));
    }

    public Tag create(Tag tag) {
        if (tagRepository.findByName(tag.getName()).isPresent()) {
            throw new RuntimeException("Tag already exists: " + tag.getName());
        }
        return tagRepository.save(tag);
    }

    public Tag update(Integer id, Tag updatedTag) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tag not found"));
        tag.setName(updatedTag.getName());
        return tagRepository.save(tag);
    }

    public void delete(Integer id) {
        if (!tagRepository.existsById(id)) {
            throw new RuntimeException("Tag not found");
        }
        tagRepository.deleteById(id);
    }
}
