package com.smartcampus.ops.facility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FacilityAnalyticsService {

    @Autowired
    private FacilityRepository facilityRepository;

    // Get all facilities with booking counts (simulated for demo)
    public Map<String, Object> getMostBookedFacilities() {
        List<Facility> facilities = facilityRepository.findAll();
        
        // Simulated booking data (in real app, get from Booking repository)
        Map<String, Integer> bookingCounts = new HashMap<>();
        bookingCounts.put("Hall A", 45);
        bookingCounts.put("Hall B", 38);
        bookingCounts.put("Computer Lab 1", 52);
        bookingCounts.put("Computer Lab 2", 30);
        bookingCounts.put("Meeting Room A", 25);
        bookingCounts.put("Meeting Room B", 20);
        bookingCounts.put("Projector X1", 15);
        bookingCounts.put("Camera Kit", 5);
        
        // Sort by booking count
        List<Map<String, Object>> mostBooked = bookingCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(5)
            .map(entry -> {
                Map<String, Object> item = new HashMap<>();
                item.put("name", entry.getKey());
                item.put("bookings", entry.getValue());
                return item;
            })
            .collect(Collectors.toList());
        
        Map<String, Object> response = new HashMap<>();
        response.put("mostBooked", mostBooked);
        return response;
    }
    
    // Get peak booking hours
    public Map<String, Object> getPeakHours() {
        Map<String, Integer> peakHours = new LinkedHashMap<>();
        peakHours.put("08:00-09:00", 12);
        peakHours.put("09:00-10:00", 28);
        peakHours.put("10:00-11:00", 35);
        peakHours.put("11:00-12:00", 42);
        peakHours.put("12:00-13:00", 18);
        peakHours.put("13:00-14:00", 22);
        peakHours.put("14:00-15:00", 38);
        peakHours.put("15:00-16:00", 31);
        peakHours.put("16:00-17:00", 15);
        
        Map<String, Object> response = new HashMap<>();
        response.put("peakHours", peakHours);
        return response;
    }
    
    // Get facility utilization rates
    public Map<String, Object> getUtilizationRates() {
        List<Facility> facilities = facilityRepository.findAll();
        List<Map<String, Object>> utilization = new ArrayList<>();
        
        // Simulated utilization data
        Map<String, Double> utilData = new HashMap<>();
        utilData.put("Hall A", 75.0);
        utilData.put("Hall B", 62.0);
        utilData.put("Computer Lab 1", 85.0);
        utilData.put("Computer Lab 2", 50.0);
        utilData.put("Meeting Room A", 42.0);
        utilData.put("Meeting Room B", 35.0);
        utilData.put("Projector X1", 28.0);
        utilData.put("Camera Kit", 10.0);
        
        for (Facility facility : facilities) {
            Map<String, Object> item = new HashMap<>();
            item.put("name", facility.getName());
            item.put("type", facility.getType());
            item.put("utilization", utilData.getOrDefault(facility.getName(), 0.0));
            utilization.add(item);
        }
        
        // Sort by utilization (highest first)
        utilization.sort((a, b) -> Double.compare(
            (Double) b.get("utilization"), 
            (Double) a.get("utilization")
        ));
        
        Map<String, Object> response = new HashMap<>();
        response.put("utilization", utilization);
        return response;
    }
    
    // Get total stats
    public Map<String, Object> getTotalStats() {
        List<Facility> facilities = facilityRepository.findAll();
        
        long activeCount = facilities.stream()
            .filter(f -> "ACTIVE".equals(f.getStatus()))
            .count();
        long inactiveCount = facilities.stream()
            .filter(f -> "OUT_OF_SERVICE".equals(f.getStatus()))
            .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFacilities", facilities.size());
        stats.put("activeFacilities", activeCount);
        stats.put("inactiveFacilities", inactiveCount);
        stats.put("totalBookings", 245); // Simulated
        stats.put("avgUtilization", 48.5); // Simulated
        
        return stats;
    }
}