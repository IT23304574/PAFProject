package com.smartcampus.ops.ticket.controller; // Note the package change to 'ticket'

import com.smartcampus.ops.ticket.model.Ticket;
import com.smartcampus.ops.ticket.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@CrossOrigin
public class TicketController {

    @Autowired
    private TicketService ticketService; // Use Service, not Repository!

    @GetMapping
    public List<Ticket> getAllTickets() {
        return ticketService.getAll();
    }

    @PostMapping
    public Ticket createTicket(@RequestBody Ticket ticket) {
        // The Service will handle the Instant.now() and "OPEN" status
        return ticketService.saveTicket(ticket);
    }

    @PutMapping("/{id}/status")
    public Ticket updateStatus(
            @PathVariable String id, 
            @RequestParam String status, 
            @RequestParam(required = false) String note) {
        // This fulfills the requirement: Admin sets status with reason
        return ticketService.updateStatus(id, status, note);
    }
}