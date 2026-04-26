package com.smartcampus.ops.ticket;

import com.smartcampus.ops.common.BadRequestException;
import com.smartcampus.ops.common.NotFoundException;
import com.smartcampus.ops.notifications.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Map;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    @Autowired private TicketRepository ticketRepository;
    @Autowired private NotificationService notificationService;

    @Value("${app.uploads.dir}")
    private String uploadsDir;

    // Allowed MIME types for image uploads
    private static final List<String> ALLOWED_TYPES =
            List.of("image/jpeg", "image/png", "image/gif", "image/webp");
    private static final List<String> ALLOWED_STATUS =
            List.of("OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "REJECTED");

    public Ticket createTicket(Ticket ticket) {
        if (ticket.resourceId == null || ticket.description == null
                || ticket.category == null || ticket.priority == null
                || ticket.userId == null) {
            throw new BadRequestException(
                    "resourceId, description, category, priority, and userId are required");
        }
        ticket.status    = "OPEN";
        ticket.createdAt = Instant.now();
        ticket.updatedAt = Instant.now();
        Ticket saved = ticketRepository.save(ticket);

        // Notify admin (userId = "admin") — or broadcast; simplified here
        notificationService.send("admin", "New Ticket Opened",
                "A new " + ticket.priority + " priority ticket has been submitted: " + ticket.category,
                "ticket");
        return saved;
    }

    public Ticket addAttachment(String ticketId, MultipartFile file) throws IOException {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));

        if (file.isEmpty()) throw new BadRequestException("File is empty");
        if (ticket.attachments != null && ticket.attachments.size() >= 3) {
            throw new BadRequestException("Maximum 3 attachments allowed per ticket");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new BadRequestException("Only image files (JPEG, PNG, GIF, WebP) are allowed");
        }

        long maxBytes = 5 * 1024 * 1024L;
        if (file.getSize() > maxBytes) {
            throw new BadRequestException("File size must not exceed 5 MB");
        }

        // Save file to uploads directory
        Path uploadPath = Paths.get(uploadsDir, "tickets");
        Files.createDirectories(uploadPath);

        String ext      = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + ext;
        Path   filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Store relative URL path (serve via static resource or dedicated endpoint)
        String url = "/uploads/tickets/" + filename;
        if (ticket.attachments == null) ticket.attachments = new java.util.ArrayList<>();
        ticket.attachments.add(url);
        ticket.updatedAt = Instant.now();
        return ticketRepository.save(ticket);
    }

    public Ticket updateStatus(String ticketId, String newStatus,
                                String note, String actorUserId, String actorRole) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));

        if (newStatus == null || !ALLOWED_STATUS.contains(newStatus)) {
            throw new BadRequestException("Invalid status value");
        }

        validateStatusTransition(ticket, newStatus, actorUserId, actorRole);

        ticket.status    = newStatus;
        ticket.updatedAt = Instant.now();

        if ("RESOLVED".equals(newStatus) || "CLOSED".equals(newStatus)) {
            ticket.resolvedAt      = Instant.now();
            ticket.resolutionNote  = note;
        }
        if ("REJECTED".equals(newStatus)) {
            ticket.rejectionReason = note;
        }

        Ticket saved = ticketRepository.save(ticket);

        // Notify the ticket owner
        notificationService.send(ticket.userId,
                "Ticket Status Updated",
                "Your ticket status changed to: " + newStatus,
                "ticket");

        return saved;
    }

    public Ticket addComment(String ticketId, Ticket.Comment comment) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));

        comment.id        = UUID.randomUUID().toString();
        comment.createdAt = Instant.now();
        comment.updatedAt = comment.createdAt;
        if (ticket.comments == null) ticket.comments = new java.util.ArrayList<>();
        ticket.comments.add(comment);
        ticket.updatedAt = Instant.now();
        return ticketRepository.save(ticket);
    }

    public Ticket updateComment(String ticketId, String commentId, String text, String actorUserId) {
        if (text == null || text.trim().isEmpty()) {
            throw new BadRequestException("Comment text is required");
        }
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));

        Ticket.Comment comment = ticket.comments.stream()
                .filter(c -> c.id.equals(commentId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Comment not found"));

        if (!actorUserId.equals(comment.userId)) {
            throw new BadRequestException("Only comment owner can edit this comment");
        }

        comment.text = text.trim();
        comment.updatedAt = Instant.now();
        ticket.updatedAt = Instant.now();
        return ticketRepository.save(ticket);
    }

    public Ticket deleteComment(String ticketId, String commentId, String actorUserId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new NotFoundException("Ticket not found"));
        boolean removed = ticket.comments.removeIf(
                c -> c.id.equals(commentId) && c.userId.equals(actorUserId));
        if (!removed) {
            throw new BadRequestException("Only comment owner can delete this comment");
        }
        ticket.updatedAt = Instant.now();
        return ticketRepository.save(ticket);
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return ".jpg";
        return filename.substring(filename.lastIndexOf('.'));
    }

    private void validateStatusTransition(Ticket ticket, String newStatus, String actorUserId, String actorRole) {
        String currentStatus = ticket.status == null ? "OPEN" : ticket.status;
        boolean isAdmin = "ROLE_ADMIN".equals(actorRole);
        boolean isAssignedTechnician = "ROLE_TECHNICIAN".equals(actorRole) && actorUserId != null && actorUserId.equals(ticket.assignedTo);

        if (!isAdmin && !isAssignedTechnician) {
            throw new BadRequestException("Only assigned technician or admin can update ticket status");
        }

        if ("REJECTED".equals(newStatus) && !isAdmin) {
            throw new BadRequestException("Only admin can reject tickets");
        }

        Map<String, List<String>> transitions = Map.of(
                "OPEN", List.of("IN_PROGRESS", "REJECTED"),
                "IN_PROGRESS", List.of("RESOLVED", "REJECTED"),
                "RESOLVED", List.of("CLOSED"),
                "CLOSED", new ArrayList<>(),
                "REJECTED", new ArrayList<>()
        );

        if (!transitions.getOrDefault(currentStatus, List.of()).contains(newStatus)) {
            throw new BadRequestException("Invalid status transition: " + currentStatus + " -> " + newStatus);
        }
    }
}