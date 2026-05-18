package com.stackoverflow.backend.client;

public class NotificationBanRequest {
    private Integer userId;
    private String username;
    private String email;
    private String phone;
    private String reason;

    public NotificationBanRequest(
            Integer userId,
            String username,
            String email,
            String phone,
            String reason) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.reason = reason;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getReason() {
        return reason;
    }
}
