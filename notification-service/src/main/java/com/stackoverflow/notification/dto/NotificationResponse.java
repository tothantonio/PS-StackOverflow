package com.stackoverflow.notification.dto;

public class NotificationResponse {

    private boolean emailSent;
    private boolean smsSent;
    private String message;

    public NotificationResponse() {
    }

    public NotificationResponse(boolean emailSent, boolean smsSent, String message) {
        this.emailSent = emailSent;
        this.smsSent = smsSent;
        this.message = message;
    }

    public boolean isEmailSent() {
        return emailSent;
    }

    public void setEmailSent(boolean emailSent) {
        this.emailSent = emailSent;
    }

    public boolean isSmsSent() {
        return smsSent;
    }

    public void setSmsSent(boolean smsSent) {
        this.smsSent = smsSent;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
