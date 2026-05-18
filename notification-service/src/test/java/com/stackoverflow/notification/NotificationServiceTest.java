package com.stackoverflow.notification;

import com.stackoverflow.notification.dto.BanNotificationRequest;
import com.stackoverflow.notification.dto.NotificationResponse;
import com.stackoverflow.notification.service.EmailDeliveryService;
import com.stackoverflow.notification.service.NotificationService;
import com.stackoverflow.notification.service.SmsDeliveryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private EmailDeliveryService emailDeliveryService;

    @Mock
    private SmsDeliveryService smsDeliveryService;

    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        notificationService = new NotificationService(emailDeliveryService, smsDeliveryService);
    }

    @Test
    void sendBanNotification_ShouldSendEmailAndSms() {
        BanNotificationRequest request = new BanNotificationRequest();
        request.setUserId(5);
        request.setUsername("alex");
        request.setEmail("alex@example.com");
        request.setPhone("+40700111222");
        request.setReason("Spam");

        when(emailDeliveryService.send(anyString(), anyString(), anyString())).thenReturn(true);
        when(smsDeliveryService.send(anyString(), anyString())).thenReturn(true);

        NotificationResponse response = notificationService.sendBanNotification(request);

        assertTrue(response.isEmailSent());
        assertTrue(response.isSmsSent());
        verify(emailDeliveryService).send(eq("alex@example.com"), contains("banned"), contains("Spam"));
        verify(smsDeliveryService).send(eq("+40700111222"), contains("Spam"));
    }

    @Test
    void sendBanNotification_ShouldUseDefaultReasonWhenMissing() {
        BanNotificationRequest request = new BanNotificationRequest();
        request.setUserId(1);
        request.setUsername("maria");
        request.setEmail("maria@example.com");

        when(emailDeliveryService.send(anyString(), anyString(), anyString())).thenReturn(true);
        when(smsDeliveryService.send(isNull(), anyString())).thenReturn(false);

        notificationService.sendBanNotification(request);

        verify(emailDeliveryService).send(anyString(), anyString(), contains("community guidelines"));
    }
}
