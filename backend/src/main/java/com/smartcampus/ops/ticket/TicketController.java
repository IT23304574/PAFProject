package com.smartcampus.ops.ticket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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

@RestController
@RequestMapping("/api/ticket")
public class TicketController {

    private static final Logger log = LoggerFactory.getLogger(TicketController.class);

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
    }
}