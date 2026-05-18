package com.stackoverflow.backend.client;

import com.stackoverflow.backend.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class NotificationClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationClient.class);

    private final RestClient restClient;
    private final boolean enabled;

    public NotificationClient(@Value("${notification.service.url:http://localhost:8081}") String baseUrl) {
        this.enabled = baseUrl != null && !baseUrl.isBlank();
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public void sendBanNotification(User user, String reason) {
        if (!enabled) {
            return;
        }

        try {
            restClient.post()
                    .uri("/api/notifications/ban")
                    .body(new NotificationBanRequest(
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getPhone(),
                            reason
                    ))
                    .retrieve()
                    .toBodilessEntity();
            log.info("Ban notification sent for user {}", user.getId());
        } catch (Exception ex) {
            log.warn("Failed to send ban notification for user {}: {}", user.getId(), ex.getMessage());
        }
    }
}
