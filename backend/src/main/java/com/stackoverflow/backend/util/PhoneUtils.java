package com.stackoverflow.backend.util;

public final class PhoneUtils {

    private PhoneUtils() {
    }

    public static String normalize(String phone) {
        if (phone == null || phone.isBlank()) {
            return null;
        }
        String trimmed = phone.trim();
        if (!trimmed.matches("^\\+?[1-9]\\d{7,14}$")) {
            throw new RuntimeException("Phone must be in international format, e.g. +40700111222");
        }
        return trimmed.startsWith("+") ? trimmed : "+" + trimmed;
    }
}
