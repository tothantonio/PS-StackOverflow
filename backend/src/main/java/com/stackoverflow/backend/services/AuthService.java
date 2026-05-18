package com.stackoverflow.backend.services;

import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.entity.UserRole;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.util.PhoneUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Simple token storage
    private final Map<String, Integer> tokenToUserId = new HashMap<>();


    // Login user and return authentication token
    public Map<String, Object> login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid username or password");
        }

        if (user.getIsBanned()) {
            throw new RuntimeException("User account is banned");
        }

        // Generate token
        String token = UUID.randomUUID().toString();
        tokenToUserId.put(token, user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", new HashMap<String, Object>() {{
            put("id", user.getId());
            put("username", user.getUsername());
            put("email", user.getEmail());
            put("phone", user.getPhone());
            put("score", user.getScore());
            put("role", user.getRole());
            put("isBanned", user.getIsBanned());
        }});

        return response;
    }

    // Register new user
    public User register(String username, String email, String password, String phone) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already in use");
        }

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already in use");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setEmail(email);
        newUser.setPassword(password);
        newUser.setPhone(PhoneUtils.normalize(phone));
        newUser.setScore(0.0);
        newUser.setRole(UserRole.USER);
        newUser.setIsBanned(false);

        return userRepository.save(newUser);
    }

    // Logout user by removing token
    public void logout(String token) {
        tokenToUserId.remove(token);
    }

    public void invalidateUserTokens(Integer userId) {
        tokenToUserId.entrySet().removeIf(entry -> userId.equals(entry.getValue()));
    }
}
