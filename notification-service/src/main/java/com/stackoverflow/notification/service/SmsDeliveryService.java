package com.stackoverflow.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@Service
public class SmsDeliveryService {

    private static final Logger log = LoggerFactory.getLogger(SmsDeliveryService.class);

    private final String mode;
    private final String accountSid;
    private final String authToken;
    private final String fromNumber;
    private final RestClient twilioClient;

    public SmsDeliveryService(
            @Value("${notification.sms.mode:console}") String mode,
            @Value("${twilio.account-sid:}") String accountSid,
            @Value("${twilio.auth-token:}") String authToken,
            @Value("${twilio.from-number:}") String fromNumber) {
        this.mode = mode;
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.fromNumber = fromNumber;
        this.twilioClient = RestClient.builder().build();
    }

    public boolean send(String phone, String message) {
        if (phone == null || phone.isBlank()) {
            log.warn("[SMS] Skipped — no phone number on user profile");
            return false;
        }

        if ("twilio".equalsIgnoreCase(mode)) {
            return sendViaTwilio(phone, message);
        }

        log.info("[SMS] to={} message={}", phone, message);
        return true;
    }

    private boolean sendViaTwilio(String phone, String message) {
        if (accountSid.isBlank() || authToken.isBlank() || fromNumber.isBlank()) {
            log.error("[SMS] Twilio mode enabled but twilio.account-sid, twilio.auth-token, or twilio.from-number is missing");
            return false;
        }

        try {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("From", fromNumber);
            form.add("To", phone);
            form.add("Body", message);

            twilioClient.post()
                    .uri("https://api.twilio.com/2010-04-01/Accounts/{accountSid}/Messages.json", accountSid)
                    .headers(headers -> headers.setBasicAuth(accountSid, authToken))
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .toBodilessEntity();

            log.info("[SMS] Sent ban notification to {}", phone);
            return true;
        } catch (Exception ex) {
            log.error("[SMS] Twilio failed for {}: {}", phone, ex.getMessage());
            return false;
        }
    }
}
