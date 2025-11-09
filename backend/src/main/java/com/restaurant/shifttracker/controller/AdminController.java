package com.restaurant.shifttracker.controller;

import com.restaurant.shifttracker.dto.EmployeeRequest;
import com.restaurant.shifttracker.dto.EmployeeResponse;
import com.restaurant.shifttracker.dto.WeeklyHoursResponse;
import com.restaurant.shifttracker.service.EmployeeService;
import com.restaurant.shifttracker.service.ShiftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final EmployeeService employeeService;
    private final ShiftService shiftService;
    
    @PostMapping("/employees")
    public ResponseEntity<EmployeeResponse> createEmployee(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.createEmployee(request));
    }
    
    @PutMapping("/employees/{id}")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Long id, 
            @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, request));
    }
    
    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeResponse>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }
    
    @GetMapping("/weekly-hours")
    public ResponseEntity<List<WeeklyHoursResponse>> getAllEmployeesWeeklyHours() {
        return ResponseEntity.ok(shiftService.getAllEmployeesWeeklyHours());
    }
}