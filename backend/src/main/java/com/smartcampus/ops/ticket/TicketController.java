package com.smartcampus.ops.ticket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ticket")
@CrossOrigin
public class TicketController {
  private static final Logger log = LoggerFactory.getLogger(TicketController.class);

  @Autowired
  private TicketRepository ticketRepository;

  @GetMapping
  public List<Ticket> all() {
    List<Ticket> list = ticketRepository.findAll();
    log.info("Total tickets in database: {}", list.size());
    return list;
  }

  @GetMapping("/me")
  public List<Ticket> mine(@RequestParam("userId") String userId) {
    try {
      // Basic validation for MongoDB ObjectId format (24 hex characters)
      // Also handles null, empty, "undefined", or email strings
      if (userId == null || userId.trim().isEmpty() || userId.equalsIgnoreCase("undefined") || userId.contains("@") || !userId.matches("^[0-9a-fA-F]{24}$")) {
        log.warn("Invalid or malformed userId received for tickets: '{}'. Returning empty list.", userId);
        // Frontend should handle this gracefully, e.g., redirect to login or show a message
        return List.of();
      }
      List<Ticket> list = ticketRepository.findByUserId(userId);
      log.info("Ticket check for ID: {}. Found: {}.", userId, list.size());
      return list;
    } catch (Exception e) {
      log.error("CRITICAL ERROR fetching tickets for user {}: {}", userId, e.getMessage());
      e.printStackTrace(); // Look at your terminal for this output!
      throw e;
    }
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

    if (ticket.resourceId == null || ticket.description == null || ticket.category == null || ticket.priority == null || ticket.userId == null) {
      throw new com.smartcampus.ops.common.BadRequestException("resourceId, description, category, priority, and userId are required");
    }
    
    // Initialize defaults because Jackson skips the constructor
    if (ticket.status == null) ticket.status = "OPEN";
    ticket.createdAt = Instant.now();
    ticket.updatedAt = Instant.now();

    return ticketRepository.save(ticket);
  }

  // Placeholder for file upload endpoint
  @PostMapping("/{id}/attachments")
  public Ticket addAttachment(@PathVariable String id) {
    throw new UnsupportedOperationException("File upload not yet implemented on backend.");
  }
}