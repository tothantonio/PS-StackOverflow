package com.stackoverflow.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

@Service
public class SmsDeliveryService {

    private static final Logger log = LoggerFactory.getLogger(SmsDeliveryService.class);

    private final String mode;

    public SmsDeliveryService(
            @Value("${notification.sms.mode:console}") String mode) {
        this.mode = mode;
    }

    public boolean send(String phone, String message) {
        if (phone == null || phone.isBlank()) {
            log.warn("[SMS] Skipped — no phone number");
            return false;
        }

        log.info("[SMS - {}] to={} message={}", mode, phone, message);
        return true;
    }
}