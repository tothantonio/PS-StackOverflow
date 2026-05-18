package com.stackoverflow.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailDeliveryService {

    private static final Logger log = LoggerFactory.getLogger(EmailDeliveryService.class);

    private final JavaMailSender mailSender;
    private final String mode;
    private final String fromAddress;

    public EmailDeliveryService(
            @Autowired(required = false) JavaMailSender mailSender,
            @Value("${notification.email.mode:console}") String mode,
            @Value("${notification.mail.from:noreply@stackoverflow.local}") String fromAddress) {
        this.mailSender = mailSender;
        this.mode = mode;
        this.fromAddress = fromAddress;
    }

    public boolean send(String to, String subject, String body) {
        if ("smtp".equalsIgnoreCase(mode)) {
            return sendViaSmtp(to, subject, body);
        }
        log.info("[EMAIL] to={} subject={} body={}", to, subject, body);
        return true;
    }

    private boolean sendViaSmtp(String to, String subject, String body) {
        if (mailSender == null) {
            log.error("[EMAIL] SMTP mode enabled but JavaMailSender is not configured");
            return false;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            log.info("[EMAIL] Sent ban notification to {}", to);
            return true;
        } catch (Exception ex) {
            log.error("[EMAIL] Failed to send to {}: {}", to, ex.getMessage());
            return false;
        }
    }
}
