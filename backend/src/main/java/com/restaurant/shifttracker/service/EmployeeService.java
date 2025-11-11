package com.restaurant.shifttracker.service;

import com.restaurant.shifttracker.dto.EmployeeRequest;
import com.restaurant.shifttracker.dto.EmployeeResponse;
import com.restaurant.shifttracker.entity.Employee;
import com.restaurant.shifttracker.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        Employee employee = Employee.builder()
                .name(request.getName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Employee.Role.EMPLOYEE)
                .isActive(true)
                .build();
        
        employee = employeeRepository.save(employee);
        return mapToResponse(employee);
    }
    
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        if (!employee.getUsername().equals(request.getUsername()) && 
            employeeRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        employee.setName(request.getName());
        employee.setUsername(request.getUsername());
        
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        
        employee = employeeRepository.save(employee);
        return mapToResponse(employee);
    }
    
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        if (employee.getRole() == Employee.Role.ADMIN) {
            throw new RuntimeException("Cannot delete admin user");
        }
        
        employeeRepository.delete(employee);
    }
    
    public List<EmployeeResponse> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        return mapToResponse(employee);
    }
    
    private EmployeeResponse mapToResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .name(employee.getName())
                .username(employee.getUsername())
                .role(employee.getRole().name())
                .isActive(employee.getIsActive())
                .createdAt(employee.getCreatedAt())
                .build();
    }
}