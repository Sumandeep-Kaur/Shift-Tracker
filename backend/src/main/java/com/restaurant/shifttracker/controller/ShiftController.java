package com.restaurant.shifttracker.controller;

import com.restaurant.shifttracker.dto.ShiftResponse;
import com.restaurant.shifttracker.dto.WeeklyHoursResponse;
import com.restaurant.shifttracker.service.ShiftService;
import com.restaurant.shifttracker.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
public class ShiftController {
    
    private final ShiftService shiftService;
    private final JwtUtil jwtUtil;
    
    @PostMapping("/clock-in")
    public ResponseEntity<ShiftResponse> clockIn(@RequestHeader("Authorization") String token) {
        Long employeeId = extractEmployeeId(token);
        return ResponseEntity.ok(shiftService.clockIn(employeeId));
    }
    
    @PostMapping("/clock-out")
    public ResponseEntity<ShiftResponse> clockOut(@RequestHeader("Authorization") String token) {
        Long employeeId = extractEmployeeId(token);
        return ResponseEntity.ok(shiftService.clockOut(employeeId));
    }
    
    @GetMapping("/active")
    public ResponseEntity<ShiftResponse> getActiveShift(@RequestHeader("Authorization") String token) {
        Long employeeId = extractEmployeeId(token);
        return shiftService.getActiveShift(employeeId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/weekly-hours")
    public ResponseEntity<WeeklyHoursResponse> getWeeklyHours(@RequestHeader("Authorization") String token) {
        Long employeeId = extractEmployeeId(token);
        return ResponseEntity.ok(shiftService.getWeeklyHours(employeeId));
    }
    
    private Long extractEmployeeId(String token) {
        String jwt = token.substring(7);
        return jwtUtil.extractUserId(jwt);
    }
}