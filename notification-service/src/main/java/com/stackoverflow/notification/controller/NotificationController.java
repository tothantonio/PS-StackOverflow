package com.stackoverflow.notification.controller;

import com.stackoverflow.notification.dto.BanNotificationRequest;
import com.stackoverflow.notification.dto.NotificationResponse;
import com.stackoverflow.notification.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/health")
    public String health() {
        return "notification-service ok";
    }

    @PostMapping("/ban")
    public NotificationResponse notifyBan(@Valid @RequestBody BanNotificationRequest request) {
        return notificationService.sendBanNotification(request);
    }
}
