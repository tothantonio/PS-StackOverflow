package com.stackoverflow.backend;

import com.stackoverflow.backend.client.NotificationClient;
import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.entity.UserRole;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.services.AuthService;
import com.stackoverflow.backend.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationClient notificationClient;

    @Mock
    private AuthService authService;

    @InjectMocks
    private UserService userService;

    private User buildUser(String username, String email) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        return user;
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

    @Test
    void banUser_ShouldBanAndNotify_WhenModerator() {
        User moderator = buildUser("mod", "mod@test.com");
        moderator.setId(1);
        moderator.setRole(UserRole.MODERATOR);

        User target = buildUser("bad", "bad@test.com");
        target.setId(2);
        target.setRole(UserRole.USER);

        when(userRepository.findById(1)).thenReturn(Optional.of(moderator));
        when(userRepository.findById(2)).thenReturn(Optional.of(target));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User banned = userService.banUser(2, 1, "Spam");

        assertTrue(banned.getIsBanned());
        verify(authService).invalidateUserTokens(2);
        verify(notificationClient).sendBanNotification(banned, "Spam");
    }

    @Test
    void unbanUser_ShouldClearBan_WhenModerator() {
        User moderator = buildUser("mod", "mod@test.com");
        moderator.setId(1);
        moderator.setRole(UserRole.MODERATOR);

        User target = buildUser("bad", "bad@test.com");
        target.setId(2);
        target.setIsBanned(true);

        when(userRepository.findById(1)).thenReturn(Optional.of(moderator));
        when(userRepository.findById(2)).thenReturn(Optional.of(target));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User unbanned = userService.unbanUser(2, 1);

        assertFalse(unbanned.getIsBanned());
    }

    @Test
    void updateProfile_ShouldSaveEmailAndPhone() {
        User user = buildUser("alex", "alex@test.com");
        user.setId(1);

        when(userRepository.findById(1)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User updated = userService.updateProfile(1, "new@test.com", "+40700111222");

        assertEquals("new@test.com", updated.getEmail());
        assertEquals("+40700111222", updated.getPhone());
    }

    @Test
    void banUser_ShouldThrow_WhenNotModerator() {
        User regular = buildUser("user", "user@test.com");
        regular.setId(1);
        regular.setRole(UserRole.USER);

        when(userRepository.findById(1)).thenReturn(Optional.of(regular));

        assertThrows(RuntimeException.class, () -> userService.banUser(2, 1, "Spam"));
        verify(notificationClient, never()).sendBanNotification(any(), any());
    }
}
