package com.smartcampus.ops.resources;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {
  List<Resource> findByLocation(String location);
  List<Resource> findByType(String type);
  List<Resource> findByStatus(String status);
}
