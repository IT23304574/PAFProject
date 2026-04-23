@Service
public class TicketService {

    @Autowired
    private IncidentTicketRepository repository;

    public Ticket saveTicket(Ticket ticket) {
        // Requirement: Logic for attachments
        if (ticket.getAttachments() != null && ticket.getAttachments().size() > 3) {
            throw new RuntimeException("Maximum 3 attachments allowed.");
        }
        
        ticket.setStatus("OPEN");
        ticket.setCreatedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());
        return repository.save(ticket);
    }

    public Ticket updateStatus(String id, String newStatus, String note) {
        Ticket ticket = repository.findById(id).orElseThrow();
        
        // Requirement: Rejected must have a reason
        if (newStatus.equals("REJECTED") && (note == null || note.isEmpty())) {
            throw new RuntimeException("Rejection reason is required.");
        }

        ticket.setStatus(newStatus);
        ticket.setResolutionNotes(note);
        ticket.setUpdatedAt(Instant.now());
        return repository.save(ticket);
    }
}