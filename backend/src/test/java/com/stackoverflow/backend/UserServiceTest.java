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
public class UserServiceTest {

    @Mock private UserRepository userRepository;
    @InjectMocks private UserService userService;

    private User mockUser(Integer id, String name, String email) {
        User u = new User(); u.setId(id); u.setUsername(name); u.setEmail(email); u.setPassword("pass"); return u;
    }

    @Test
    void testCreate() {
        User user = mockUser(1, "user1", "test@example.com");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User res = userService.create(user);
        assertEquals(0.0, res.getScore());
        assertEquals(UserRole.USER, res.getRole());
        verify(userRepository).save(user);

        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        assertThrows(RuntimeException.class, () -> userService.create(user), "Email already in use");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.existsByUsername(anyString())).thenReturn(true);
        assertThrows(RuntimeException.class, () -> userService.create(user), "Username already in use");
    }

    @Test
    void testGetAll() {
        when(userRepository.findAll()).thenReturn(List.of(mockUser(1, "u1", "e1"), mockUser(2, "u2", "e2")));
        assertEquals(2, ((List<User>) userService.getAll()).size());
    }

    @Test
    void testGetById() {
        when(userRepository.findById(1)).thenReturn(Optional.of(mockUser(1, "user1", "e1")));
        assertEquals("user1", userService.getById(1).getUsername());

        when(userRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userService.getById(99));
    }

    @Test
    void testUpdate() {
        User existing = mockUser(1, "old", "old@e.com");
        when(userRepository.findById(1)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenReturn(existing);

        User res = userService.update(1, mockUser(1, "new", "new@e.com"));
        assertEquals("new", res.getUsername());

        when(userRepository.findById(99)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userService.update(99, existing));
    }

    @Test
    void testDelete() {
        when(userRepository.existsById(1)).thenReturn(true);
        userService.delete(1);
        verify(userRepository).deleteById(1);

        when(userRepository.existsById(99)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> userService.delete(99));
    }
}