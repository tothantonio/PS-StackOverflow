package com.stackoverflow.backend;

import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.services.AuthService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthService authService;

    @Test
    void login_ShouldThrow_WhenUserBanned() {
        User user = new User();
        user.setId(1);
        user.setUsername("banned");
        user.setPassword("secret");
        user.setIsBanned(true);

        when(userRepository.findByUsername("banned")).thenReturn(Optional.of(user));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> authService.login("banned", "secret"));

        assertEquals("User account is banned", ex.getMessage());
    }
}
