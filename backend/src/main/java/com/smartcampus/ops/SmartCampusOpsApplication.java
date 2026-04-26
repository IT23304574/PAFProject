package com.smartcampus.ops;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.smartcampus.ops"})
public class SmartCampusOpsApplication {
    public static void main(String[] args) {
        SpringApplication.run(SmartCampusOpsApplication.class, args);
    }
}