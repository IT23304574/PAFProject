package com.smartcampus.ops.notifications.controller;

import com.smartcampus.ops.notifications.service.NotificationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestTriggerController {

    private final NotificationService notificationService;

    public TestTriggerController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // 🔔 Simulate booking approval
    @PostMapping("/booking-approved")
    public String bookingApproved(@RequestParam String userId) {

        notificationService.create(
                userId,
                "Booking Approved",
                "Your booking has been approved",
                "BOOKING"
        );

        return "Booking notification sent!";
    }

    // 🔔 Simulate ticket update
    @PostMapping("/ticket-updated")
    public String ticketUpdated(@RequestParam String userId) {

        notificationService.create(
                userId,
                "Ticket Updated",
                "Your issue is now in progress",
                "TICKET"
        );

        return "Ticket notification sent!";
    }
}