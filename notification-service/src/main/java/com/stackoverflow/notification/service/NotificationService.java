package com.stackoverflow.notification.service;

import com.stackoverflow.notification.dto.BanNotificationRequest;
import com.stackoverflow.notification.dto.NotificationResponse;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final EmailDeliveryService emailDeliveryService;
    private final SmsDeliveryService smsDeliveryService;

    public NotificationService(
            EmailDeliveryService emailDeliveryService,
            SmsDeliveryService smsDeliveryService) {
        this.emailDeliveryService = emailDeliveryService;
        this.smsDeliveryService = smsDeliveryService;
    }

    public NotificationResponse sendBanNotification(BanNotificationRequest request) {
        String reason = request.getReason() != null && !request.getReason().isBlank()
                ? request.getReason().trim()
                : "Violation of community guidelines";

        String emailSubject = "Your StackOverflow account has been banned";
        String emailBody = """
                Hello %s,

                Your account has been banned from StackOverflow.

                Reason: %s

                If you believe this is a mistake, contact a moderator.

                — StackOverflow moderation team
                """.formatted(request.getUsername(), reason);

        String smsBody = "StackOverflow: Your account has been banned. Reason: " + reason;

        boolean emailSent = emailDeliveryService.send(request.getEmail(), emailSubject, emailBody);
        boolean smsSent = smsDeliveryService.send(request.getPhone(), smsBody);

        return new NotificationResponse(
                emailSent,
                smsSent,
                "Ban notification processed for user " + request.getUserId()
        );
    }
}
