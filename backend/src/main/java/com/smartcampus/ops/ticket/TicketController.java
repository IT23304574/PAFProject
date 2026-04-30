package com.smartcampus.ops.ticket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.security.core.Authentication;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.smartcampus.ops.common.BadRequestException;
import com.smartcampus.ops.common.NotFoundException;

import java.io.IOException;
import java.util.List;
import java.util.Map;
=======
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
>>>>>>> origin/main

@RestController
@RequestMapping("/api/ticket")
public class TicketController {

    private static final Logger log = LoggerFactory.getLogger(TicketController.class);

<<<<<<< HEAD
    @Autowired private TicketRepository ticketRepository;
    @Autowired private TicketService    ticketService;

    // ── List all (admin use) ──────────────────────────────────────────────────
    @GetMapping
    public List<Ticket> all(Authentication authentication) {
        requireRole(authentication, "ROLE_ADMIN");
        return ticketRepository.findAll();
    }

    // ── My tickets ────────────────────────────────────────────────────────────
    @GetMapping("/me")
    public List<Ticket> mine(Authentication authentication) {
        String userId = currentUserId(authentication);
        if (!isValidMongoId(userId)) {
            log.warn("Invalid userId: '{}'", userId);
            return List.of();
        }
        return ticketRepository.findByUserId(userId);
    }

    // ── Technician assigned tickets ───────────────────────────────────────────
    @GetMapping("/assigned")
    public List<Ticket> assigned(Authentication authentication) {
        requireRole(authentication, "ROLE_TECHNICIAN");
        String technicianId = currentUserId(authentication);
        return ticketRepository.findByAssignedTo(technicianId);
    }

    // ── Get single ticket ─────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public Ticket get(@PathVariable String id, Authentication authentication) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));
        String role = currentRole(authentication);
        String userId = currentUserId(authentication);
        boolean canAccess = "ROLE_ADMIN".equals(role)
                || userId.equals(ticket.userId)
                || ("ROLE_TECHNICIAN".equals(role) && userId.equals(ticket.assignedTo));
        if (!canAccess) {
            throw new BadRequestException("You are not allowed to view this ticket");
        }
        return ticket;
    }

    // ── Create ticket ─────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<Ticket> create(@RequestBody Ticket ticket, Authentication authentication) {
        requireRole(authentication, "ROLE_USER");
        ticket.userId = currentUserId(authentication);
        return ResponseEntity.status(201).body(ticketService.createTicket(ticket));
    }

    // ── Upload attachment (multipart) ─────────────────────────────────────────
    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Ticket> addAttachment(@PathVariable String id,
                                                 @RequestParam("file") MultipartFile file,
                                                 Authentication authentication) throws IOException {
        requireRole(authentication, "ROLE_USER");
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));
        if (!currentUserId(authentication).equals(ticket.userId)) {
            throw new BadRequestException("You can upload attachments only for your own tickets");
        }
        return ResponseEntity.ok(ticketService.addAttachment(id, file));
    }

    // ── Update status ─────────────────────────────────────────────────────────
    @PutMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(@PathVariable String id,
                                                @RequestBody Map<String, String> body,
                                                Authentication authentication) {
        String status    = body.get("status");
        String note      = body.get("note");
        String actorId   = currentUserId(authentication);
        String actorRole = currentRole(authentication);
        return ResponseEntity.ok(ticketService.updateStatus(id, status, note, actorId, actorRole));
    }

    // ── Add comment ───────────────────────────────────────────────────────────
    @PostMapping("/{id}/comments")
    public ResponseEntity<Ticket> addComment(@PathVariable String id,
                                              @RequestBody Ticket.Comment comment,
                                              @RequestHeader(value = "X-User-Name", required = false) String userName,
                                              Authentication authentication) {
        requireRole(authentication, "ROLE_USER");
        comment.userId = currentUserId(authentication);
        if (userName != null && !userName.isBlank()) {
            comment.userFullName = userName;
        } else if (comment.userFullName == null || comment.userFullName.isBlank()) {
            comment.userFullName = "User";
        }
        return ResponseEntity.ok(ticketService.addComment(id, comment));
    }

    @PutMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Ticket> updateComment(@PathVariable String ticketId,
                                                @PathVariable String commentId,
                                                @RequestBody Map<String, String> body,
                                                Authentication authentication) {
        requireRole(authentication, "ROLE_USER");
        return ResponseEntity.ok(
                ticketService.updateComment(ticketId, commentId, body.get("text"), currentUserId(authentication)));
    }

    // ── Delete comment (owner only) ───────────────────────────────────────────
    @DeleteMapping("/{ticketId}/comments/{commentId}")
    public ResponseEntity<Ticket> deleteComment(@PathVariable String ticketId,
                                                 @PathVariable String commentId,
                                                 Authentication authentication) {
        requireRole(authentication, "ROLE_USER");
        return ResponseEntity.ok(
                ticketService.deleteComment(ticketId, commentId, currentUserId(authentication)));
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private boolean isValidMongoId(String id) {
        return id != null
                && !id.trim().isEmpty()
                && !id.equalsIgnoreCase("undefined")
                && !id.contains("@")
                && id.matches("^[0-9a-fA-F]{24}$");
    }

    private String currentUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new BadRequestException("Authentication required");
        }
        return authentication.getName();
    }

    private String currentRole(Authentication authentication) {
        if (authentication == null || authentication.getAuthorities().isEmpty()) {
            throw new BadRequestException("Authentication required");
        }
        return authentication.getAuthorities().iterator().next().getAuthority();
    }

    private void requireRole(Authentication authentication, String role) {
        if (!role.equals(currentRole(authentication))) {
            throw new BadRequestException("Access denied");
        }
=======
    @Autowired
    private TicketRepository ticketRepository;

    @Value("${app.uploads.dir}")
    private String uploadsDir;

    @GetMapping
    public List<Ticket> all() {
        return ticketRepository.findAll();
    }

    @GetMapping("/me")
    public List<Ticket> mine(@RequestParam("userId") String userId) {
        if (userId == null || userId.trim().isEmpty()
                || userId.equalsIgnoreCase("undefined")
                || userId.contains("@")
                || !userId.matches("^[0-9a-fA-F]{24}$")) {
            log.warn("Invalid userId: '{}'", userId);
            return List.of();
        }
        List<Ticket> list = ticketRepository.findByUserId(userId);
        log.info("Tickets for userId {}: {}", userId, list.size());
        return list;
    }

    @GetMapping("/{id}")
    public Ticket get(@PathVariable String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new com.smartcampus.ops.common.NotFoundException("Ticket not found"));
    }

    @PostMapping
    public Ticket create(@RequestBody Ticket ticket) {
        log.info("Creating ticket: User={}, Resource={}, Category={}",
                ticket.userId, ticket.resourceId, ticket.category);
        if (ticket.resourceId == null || ticket.description == null
                || ticket.category == null || ticket.priority == null
                || ticket.userId == null) {
            throw new com.smartcampus.ops.common.BadRequestException(
                    "resourceId, description, category, priority, and userId are required");
        }
        if (ticket.status == null) ticket.status = "OPEN";
        ticket.createdAt = Instant.now();
        ticket.updatedAt = Instant.now();
        return ticketRepository.save(ticket);
    }

    @PostMapping(value = "/{id}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Ticket addAttachment(@PathVariable String id,
                                @RequestParam("file") MultipartFile file) throws IOException {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new com.smartcampus.ops.common.NotFoundException("Ticket not found"));
        if (file.isEmpty()) {
            throw new com.smartcampus.ops.common.BadRequestException("File is empty");
        }
        Path uploadPath = Paths.get(uploadsDir);
        Files.createDirectories(uploadPath);
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);
        ticket.evidenceUrl = filePath.toString();
        ticket.updatedAt = Instant.now();
        return ticketRepository.save(ticket);
>>>>>>> origin/main
    }
}