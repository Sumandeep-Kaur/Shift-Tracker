package com.restaurant.shifttracker.config;

import com.restaurant.shifttracker.entity.Employee;
import com.restaurant.shifttracker.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if admin exists
        if (!employeeRepository.existsByUsername("admin")) {
            Employee admin = Employee.builder()
                    .name("Admin")
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Employee.Role.ADMIN)
                    .isActive(true)
                    .build();
            
            employeeRepository.save(admin);
            System.out.println("Admin user created successfully!");
        }
    }
}