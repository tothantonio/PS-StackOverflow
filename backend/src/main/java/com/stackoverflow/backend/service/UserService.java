package com.stackoverflow.backend.service;

import com.stackoverflow.backend.dto.UserRequestDTO;
import com.stackoverflow.backend.dto.UserResponseDTO;
import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.entity.UserRole;
import com.stackoverflow.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserResponseDTO create(UserRequestDTO dto) {
        if (userRepository.existsByEmail(dto.email()))
            throw new RuntimeException("Email already in use");
        if (userRepository.existsByUsername(dto.username()))
            throw new RuntimeException("Username already in use");

        User user = User.builder()
                .username(dto.username())
                .email(dto.email())
                .password(passwordEncoder.encode(dto.password()))
                .score(0.0)
                .role(UserRole.USER)
                .isBanned(false)
                .build();
        return toDTO(userRepository.save(user));
    }

    public List<UserResponseDTO> getAll() {
       List<UserResponseDTO> result = new ArrayList<>();
       for(User user : userRepository.findAll()){
           result.add(toDTO(user));
       }
       return result;
    }

    public UserResponseDTO getById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toDTO(user);
    }

    public UserResponseDTO update(Integer id, UserRequestDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(dto.username());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));

        return toDTO(userRepository.save(user));
    }

    public void delete(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    private UserResponseDTO toDTO(User u) {
        return new UserResponseDTO(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getScore(),
                u.getRole(),
                u.getCreatedAt()
        );
    }
}
