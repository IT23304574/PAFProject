package com.smartcampus.ops.resources;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.smartcampus.ops.common.NotFoundException;
import com.smartcampus.ops.common.BadRequestException;

@RestController
@RequestMapping("/api/v1/resources")
@CrossOrigin
public class ResourceController {
  private static final Logger log = LoggerFactory.getLogger(ResourceController.class);

  @Autowired
  private ResourceRepository resourceRepository;

  @GetMapping
  public List<Resource> list(
    @RequestParam(required = false) String location,
    @RequestParam(required = false) String type,
    @RequestParam(required = false) String status
  ) {
    if (location != null) {
      return resourceRepository.findByLocation(location);
    }
    if (type != null) {
      return resourceRepository.findByType(type);
    }
    if (status != null) {
      return resourceRepository.findByStatus(status);
    }
    List<Resource> list = resourceRepository.findAll();
    log.info("Fetching all resources. Found: {}", list.size());
    return list;
  }

  @GetMapping("/{id}")
  public Resource get(@PathVariable String id) {
    return resourceRepository.findById(id)
      .orElseThrow(() -> new NotFoundException("Resource not found: " + id));
  }

  @PostMapping
  public Resource create(@RequestBody Resource resource) {
    if (resource.type == null || resource.location == null) {
      throw new BadRequestException("type and location are required");
    }
    if (resource.capacity <= 0) {
      throw new BadRequestException("capacity must be greater than 0");
    }
    resource.status = "AVAILABLE";
    return resourceRepository.save(resource);
  }

  @PutMapping("/{id}")
  public Resource update(@PathVariable String id, @RequestBody Resource resource) {
    Resource existing = resourceRepository.findById(id)
      .orElseThrow(() -> new NotFoundException("Resource not found: " + id));
    if (resource.type != null) existing.type = resource.type;
    if (resource.capacity > 0) existing.capacity = resource.capacity;
    if (resource.location != null) existing.location = resource.location;
    if (resource.status != null) existing.status = resource.status;
    return resourceRepository.save(existing);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable String id) {
    resourceRepository.deleteById(id);
  }
}
