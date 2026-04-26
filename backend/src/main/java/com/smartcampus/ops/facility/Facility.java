package com.smartcampus.ops.facility;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

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

    // FIX: Changed from LocalTime to String.
    // MongoDB has no native LocalTime codec in Spring Data 4.x,
    // causing ConverterNotFoundException on read. "HH:mm" strings work perfectly.
    @Field("available_from")
    private String availableFrom;

    @Field("available_to")
    private String availableTo;

    @Field("status")
    private String status;

    public Facility() {}

    public Facility(String name, String type, Integer capacity, String location,
                    String availableFrom, String availableTo, String status) {
        this.name          = name;
        this.type          = type;
        this.capacity      = capacity;
        this.location      = location;
        this.availableFrom = availableFrom;
        this.availableTo   = availableTo;
        this.status        = status;
    }

    // Getters
    public String  getId()            { return id; }
    public String  getName()          { return name; }
    public String  getType()          { return type; }
    public Integer getCapacity()      { return capacity; }
    public String  getLocation()      { return location; }
    public String  getAvailableFrom() { return availableFrom; }
    public String  getAvailableTo()   { return availableTo; }
    public String  getStatus()        { return status; }

    // Setters
    public void setId(String id)                       { this.id = id; }
    public void setName(String name)                   { this.name = name; }
    public void setType(String type)                   { this.type = type; }
    public void setCapacity(Integer capacity)          { this.capacity = capacity; }
    public void setLocation(String location)           { this.location = location; }
    public void setAvailableFrom(String availableFrom) { this.availableFrom = availableFrom; }
    public void setAvailableTo(String availableTo)     { this.availableTo = availableTo; }
    public void setStatus(String status)               { this.status = status; }
}
