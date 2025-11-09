package com.restaurant.shifttracker.service;

import com.restaurant.shifttracker.dto.LoginRequest;
import com.restaurant.shifttracker.dto.LoginResponse;
import com.restaurant.shifttracker.entity.Employee;
import com.restaurant.shifttracker.repository.EmployeeRepository;
import com.restaurant.shifttracker.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public LoginResponse login(LoginRequest request) {
        Employee employee = employeeRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!employee.getIsActive()) {
            throw new RuntimeException("Account is inactive");
        }
        
        if (!passwordEncoder.matches(request.getPassword(), employee.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String token = jwtUtil.generateToken(
            employee.getUsername(), 
            employee.getRole().name(), 
            employee.getId()
        );
        
        return new LoginResponse(
            token,
            employee.getId(),
            employee.getName(),
            employee.getUsername(),
            employee.getRole().name()
        );
    }
}