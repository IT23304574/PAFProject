package com.smartcampus.ops.facility;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalTime;

@Document(collection = "facilities")
public class Facility {

    @Id
    private String id;
    
    @Field("name")
    private String name;
    
    @Field("type")
    private String type;
    
    @Field("capacity")
    private Integer capacity;
    
    @Field("location")
    private String location;
    
    @Field("available_from")
    private LocalTime availableFrom;
    
    @Field("available_to")
    private LocalTime availableTo;
    
    @Field("status")
    private String status;

    public Facility() {}

    public Facility(String name, String type, Integer capacity, String location, 
                    LocalTime availableFrom, LocalTime availableTo, String status) {
        this.name = name;
        this.type = type;
        this.capacity = capacity;
        this.location = location;
        this.availableFrom = availableFrom;
        this.availableTo = availableTo;
        this.status = status;
    }

    // Getters
    public String getId() { return id; }
    public String getName() { return name; }
    public String getType() { return type; }
    public Integer getCapacity() { return capacity; }
    public String getLocation() { return location; }
    public LocalTime getAvailableFrom() { return availableFrom; }
    public LocalTime getAvailableTo() { return availableTo; }
    public String getStatus() { return status; }

    // Setters
    public void setId(String id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setLocation(String location) { this.location = location; }
    public void setAvailableFrom(LocalTime availableFrom) { this.availableFrom = availableFrom; }
    public void setAvailableTo(LocalTime availableTo) { this.availableTo = availableTo; }
    public void setStatus(String status) { this.status = status; }
}