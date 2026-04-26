package com.smartcampus.ops.admin;

import com.smartcampus.ops.auth.User;
import com.smartcampus.ops.auth.UserRepository;
import com.smartcampus.ops.common.BadRequestException;
import com.smartcampus.ops.common.NotFoundException;
import com.smartcampus.ops.notifications.NotificationService;
import com.smartcampus.ops.ticket.Ticket;
import com.smartcampus.ops.ticket.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired private UserRepository userRepository;
    @Autowired private TicketRepository ticketRepository;
    @Autowired private NotificationService notificationService;

    // ── Technician management ─────────────────────────────────────────────────

    @GetMapping("/technicians/pending")
    public List<User> pendingTechnicians() {
        return userRepository.findByRoleAndApprovalStatus("ROLE_TECHNICIAN", "PENDING_APPROVAL");
    }

    @GetMapping("/technicians")
    public List<User> allTechnicians() {
        return userRepository.findByRole("ROLE_TECHNICIAN");
    }

    @PutMapping("/technicians/{id}/approve")
    public ResponseEntity<User> approveTechnician(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.approvalStatus = "APPROVED";
        userRepository.save(user);
        notificationService.send(user.id, "Account Approved",
                "Your technician account has been approved. You can now log in.", "account");
        return ResponseEntity.ok(user);
    }

    @PutMapping("/technicians/{id}/reject")
    public ResponseEntity<User> rejectTechnician(@PathVariable String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.approvalStatus = "REJECTED";
        userRepository.save(user);
        notificationService.send(user.id, "Account Rejected",
                "Your technician registration has been rejected. Contact admin for details.", "account");
        return ResponseEntity.ok(user);
    }

    // ── Ticket statistics ─────────────────────────────────────────────────────

    @GetMapping("/tickets/stats")
    public Map<String, Object> ticketStats() {
        List<Ticket> all = ticketRepository.findAll();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("total", all.size());

        // By status
        Map<String, Long> byStatus = all.stream()
                .collect(Collectors.groupingBy(
                        t -> t.status != null ? t.status : "UNKNOWN",
                        Collectors.counting()));
        stats.put("byStatus", byStatus);

        // By priority
        Map<String, Long> byPriority = all.stream()
                .collect(Collectors.groupingBy(
                        t -> t.priority != null ? t.priority : "UNKNOWN",
                        Collectors.counting()));
        stats.put("byPriority", byPriority);

        // By category
        Map<String, Long> byCategory = all.stream()
                .collect(Collectors.groupingBy(
                        t -> t.category != null ? t.category : "OTHER",
                        Collectors.counting()));
        stats.put("byCategory", byCategory);

        // Open vs Closed
        long open   = all.stream().filter(t -> "OPEN".equals(t.status) || "IN_PROGRESS".equals(t.status)).count();
        long closed = all.stream().filter(t -> "RESOLVED".equals(t.status) || "CLOSED".equals(t.status)).count();
        stats.put("open", open);
        stats.put("closed", closed);

        // Recent tickets (last 10)
        List<Map<String, Object>> recent = all.stream()
                .sorted(Comparator.comparing(t -> t.createdAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .map(t -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", t.id);
                    m.put("category", t.category);
                    m.put("priority", t.priority);
                    m.put("status", t.status);
                    m.put("description", t.description != null && t.description.length() > 60
                            ? t.description.substring(0, 60) + "…" : t.description);
                    m.put("createdAt", t.createdAt);
                    return m;
                })
                .collect(Collectors.toList());
        stats.put("recentTickets", recent);

        // Avg resolution time (mock, replace with real logic if you track resolvedAt)
        stats.put("avgResolutionHours", 14);

        return stats;
    }

    // ── All tickets for admin view ────────────────────────────────────────────

    @GetMapping("/tickets")
    public List<Ticket> allTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        List<Ticket> all = ticketRepository.findAll();
        if (status != null)   all = all.stream().filter(t -> status.equals(t.status)).collect(Collectors.toList());
        if (priority != null) all = all.stream().filter(t -> priority.equals(t.priority)).collect(Collectors.toList());
        return all;
    }

    @PutMapping("/tickets/{id}/assign")
    public ResponseEntity<Ticket> assignTicket(@PathVariable String id,
                                                @RequestBody Map<String, String> body) {
        Ticket t = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));
        String technicianId = body.get("technicianId");
        if (technicianId == null || technicianId.isBlank()) {
            throw new BadRequestException("technicianId is required");
        }
        User assignee = userRepository.findById(technicianId)
                .orElseThrow(() -> new NotFoundException("Technician not found"));
        if (!"ROLE_TECHNICIAN".equals(assignee.role)) {
            throw new BadRequestException("Assignee must be a technician");
        }
        if (!"APPROVED".equals(assignee.approvalStatus)) {
            throw new BadRequestException("Technician must be approved before assignment");
        }
        t.assignedTo = technicianId;
        t.status     = "IN_PROGRESS";
        ticketRepository.save(t);
        notificationService.send(t.userId, "Ticket Assigned",
                "Your ticket #" + id.substring(0, 8) + " has been assigned to a technician.", "ticket");
        return ResponseEntity.ok(t);
    }
}