package com.stackoverflow.backend.services;

import com.stackoverflow.backend.client.NotificationClient;
import com.stackoverflow.backend.entity.User;
import com.stackoverflow.backend.entity.UserRole;
import com.stackoverflow.backend.repository.UserRepository;
import com.stackoverflow.backend.util.PhoneUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationClient notificationClient;

    @Autowired
    private AuthService authService;

    public void assertNotBanned(Integer userId) {
        User user = getById(userId);
        if (Boolean.TRUE.equals(user.getIsBanned())) {
            throw new RuntimeException("User account is banned");
        }
    }

    public void assertCanModifyContent(Integer actorId, Integer contentAuthorId) {
        assertNotBanned(actorId);
        User actor = getById(actorId);
        if (!actor.getId().equals(contentAuthorId) && actor.getRole() != UserRole.MODERATOR) {
            throw new RuntimeException("Only the author or a moderator can perform this action");
        }
    }

    public List<User> getAll() {
        return (List<User>) userRepository.findAll();
    }

    public User getById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(Integer id, String email, String phone) {
        User user = getById(id);

        if (email != null && !email.isBlank()) {
            user.setEmail(email.trim());
        }

        if (phone != null) {
            user.setPhone(PhoneUtils.normalize(phone));
        }

        return userRepository.save(user);
    }

    public User banUser(Integer userId, Integer moderatorId, String reason) {
        User moderator = getById(moderatorId);
        if (moderator.getRole() != UserRole.MODERATOR) {
            throw new RuntimeException("Only moderators can ban users");
        }

        User user = getById(userId);
        if (user.getRole() == UserRole.MODERATOR) {
            throw new RuntimeException("Moderators cannot be banned");
        }

        user.setIsBanned(true);
        User saved = userRepository.save(user);
        authService.invalidateUserTokens(userId);
        notificationClient.sendBanNotification(saved, reason);
        return saved;
    }

    public User unbanUser(Integer userId, Integer moderatorId) {
        User moderator = getById(moderatorId);
        if (moderator.getRole() != UserRole.MODERATOR) {
            throw new RuntimeException("Only moderators can unban users");
        }

        User user = getById(userId);
        user.setIsBanned(false);
        return userRepository.save(user);
    }
}
