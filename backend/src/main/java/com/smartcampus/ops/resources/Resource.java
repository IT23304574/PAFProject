package com.smartcampus.ops.resources;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "resources")
public class Resource {
  @Id
  public String id;
  public String type; // LECTURE_HALL, LAB, EQUIPMENT, ROOM
  public int capacity;
  public String location;
  public String status; // AVAILABLE, OUT_OF_SERVICE

  public Resource() {}
  public Resource(String type, int capacity, String location, String status) {
    this.type = type;
    this.capacity = capacity;
    this.location = location;
    this.status = status;
  }
}
