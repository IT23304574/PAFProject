package com.smartcampus.ops.ticket;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TicketRepository extends MongoRepository<Ticket, String> {
  List<Ticket> findByUserId(String userId);
  List<Ticket> findByResourceId(String resourceId);
}