package com.smartcampus.ops.ticket;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findByUserId(String userId);
    List<Ticket> findByResourceId(String resourceId);
    List<Ticket> findByAssignedTo(String technicianId);
    List<Ticket> findByStatus(String status);

    @Query("{ 'status': { $in: ['OPEN', 'IN_PROGRESS'] } }")
    List<Ticket> findOpenTickets();

    long countByStatus(String status);
    long countByPriority(String priority);
}