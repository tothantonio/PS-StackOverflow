package com.stackoverflow.backend;

import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.entity.UserRole;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    // helper method
    private User buildUser(String username, String email) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        return user;
    }

    @Test
    void createUser_ShouldSaveUser_WhenDataIsValid() {
        User user = buildUser("gigel", "gigel@test.com");

        when(userRepository.existsByUsername("gigel")).thenReturn(false);
        when(userRepository.existsByEmail("gigel@test.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(user);

        User savedUser = userService.create(user);

        assertNotNull(savedUser);
        assertEquals("gigel", savedUser.getUsername());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_ShouldThrowException_WhenUsernameAlreadyExists() {
        User user = buildUser("hacker", "hacker@test.com");

        when(userRepository.existsByUsername("hacker")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.create(user));

        assertEquals("Username already in use", ex.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void getUserById_ShouldReturnUser_WhenIdExists() {
        User user = buildUser("ion", "ion@test.com");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        User foundUser = userService.getById(1);

        assertNotNull(foundUser);
        assertEquals("ion", foundUser.getUsername());
    }

    @Test
    void getUserById_ShouldThrowException_WhenUserNotFound() {
        when(userRepository.findById(1)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> userService.getById(1));
    }
}