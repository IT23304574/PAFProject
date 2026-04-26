package com.smartcampus.ops.facility;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalTime;

public class FacilityDTO {
    
    private String id;
    private String name;
    private String type;
    private Integer capacity;
    private String location;
    
    @JsonFormat(pattern = "hh:mm:ss a", shape = JsonFormat.Shape.STRING)
    private LocalTime availableFrom;
    
    @JsonFormat(pattern = "hh:mm:ss a", shape = JsonFormat.Shape.STRING)
    private LocalTime availableTo;
    
    private String status;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public LocalTime getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalTime availableFrom) { this.availableFrom = availableFrom; }
    
    public LocalTime getAvailableTo() { return availableTo; }
    public void setAvailableTo(LocalTime availableTo) { this.availableTo = availableTo; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}