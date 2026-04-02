package com.stackoverflow.backend.service;

import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.entity.UserRole;
import com.stackoverflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User create(User user) {
        if (userRepository.existsByEmail(user.getEmail()))
            throw new RuntimeException("Email already in use");
        if (userRepository.existsByUsername(user.getUsername()))
            throw new RuntimeException("Username already in use");
        user.setScore(0.0);
        user.setRole(UserRole.USER);
        user.setIsBanned(false);
        return userRepository.save(user);
    }

    public List<User> getAll() {
        return (List<User>) userRepository.findAll();
    }

    public User getById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User update(Integer id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setPassword(updatedUser.getPassword());
        return userRepository.save(user);
    }

    public void delete(Integer id) {
        if (!userRepository.existsById(id))
            throw new RuntimeException("User not found");
        userRepository.deleteById(id);
    }
}