package com.smartcampus.ops.ticket;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.Instant;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "tickets")
public class Ticket {

    @Id
    public String id;

    @Field("userId")
    public String userId;

    public String resourceId;
    public String resourceName; // Denormalized for display

    public String category;     // ELECTRICAL, PLUMBING, IT_EQUIPMENT, FURNITURE, OTHER
    public String priority;     // LOW, MEDIUM, HIGH, URGENT
    public String description;
    public String status;       // OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED
    public String assignedTo;   // technician userId
    public String resolutionNote;
    public String rejectionReason;

    // Up to 3 image attachment paths/URLs
    public List<String> attachments = new ArrayList<>();

    // Comments
    public List<Comment> comments = new ArrayList<>();

    public String contactDetails;
    public int expectedAttendees;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    public Instant createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    public Instant updatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    public Instant resolvedAt;

    public Ticket() {}

    public static class Comment {
        public String id;
        public String userId;
        public String userFullName;
        public String text;
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
        public Instant createdAt;
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
        public Instant updatedAt;
    }
}