package com.smartcampus.ops.common;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class TimeParser {
    
    private static final DateTimeFormatter FORMAT_12H = DateTimeFormatter.ofPattern("hh:mm:ss a");
    private static final DateTimeFormatter FORMAT_24H = DateTimeFormatter.ofPattern("HH:mm:ss");
    
    public static LocalTime parseTime(String timeStr) {
        if (timeStr == null) return null;
        
        timeStr = timeStr.trim();
        
        // Try 24-hour format first
        try {
            return LocalTime.parse(timeStr, FORMAT_24H);
        } catch (DateTimeParseException e1) {
            // Try 12-hour format
            try {
                return LocalTime.parse(timeStr, FORMAT_12H);
            } catch (DateTimeParseException e2) {
                throw new RuntimeException("Invalid time format. Use HH:mm:ss (e.g., 14:30:00) or hh:mm:ss AM/PM (e.g., 02:30:00 PM)");
            }
        }
    }
}