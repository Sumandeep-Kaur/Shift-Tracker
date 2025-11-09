package com.restaurant.shifttracker.service;

import com.restaurant.shifttracker.dto.ShiftResponse;
import com.restaurant.shifttracker.dto.WeeklyHoursResponse;
import com.restaurant.shifttracker.entity.Employee;
import com.restaurant.shifttracker.entity.Shift;
import com.restaurant.shifttracker.repository.EmployeeRepository;
import com.restaurant.shifttracker.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShiftService {
    
    private final ShiftRepository shiftRepository;
    private final EmployeeRepository employeeRepository;
    
    @Transactional
    public ShiftResponse clockIn(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        Optional<Shift> activeShift = shiftRepository.findActiveShiftByEmployeeId(employeeId);
        if (activeShift.isPresent()) {
            throw new RuntimeException("Already clocked in");
        }
        
        Shift shift = Shift.builder()
                .employee(employee)
                .clockIn(LocalDateTime.now())
                .build();
        
        shift = shiftRepository.save(shift);
        return mapToResponse(shift);
    }
    
    @Transactional
    public ShiftResponse clockOut(Long employeeId) {
        Shift shift = shiftRepository.findActiveShiftByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("No active shift found"));
        
        LocalDateTime clockOut = LocalDateTime.now();
        shift.setClockOut(clockOut);
        
        Duration duration = Duration.between(shift.getClockIn(), clockOut);
        BigDecimal hours = BigDecimal.valueOf(duration.toMinutes())
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);
        shift.setTotalHours(hours);
        
        shift = shiftRepository.save(shift);
        return mapToResponse(shift);
    }
    
    public Optional<ShiftResponse> getActiveShift(Long employeeId) {
        return shiftRepository.findActiveShiftByEmployeeId(employeeId)
                .map(this::mapToResponse);
    }
    
    public WeeklyHoursResponse getWeeklyHours(Long employeeId) {
        LocalDateTime[] weekRange = getCurrentWeekRange();
        List<Shift> shifts = shiftRepository.findShiftsByEmployeeAndDateRange(
            employeeId, weekRange[0], weekRange[1]
        );
        
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        
        BigDecimal totalHours = shifts.stream()
                .filter(s -> s.getTotalHours() != null)
                .map(Shift::getTotalHours)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        List<ShiftResponse> shiftResponses = shifts.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        
        return WeeklyHoursResponse.builder()
                .employeeId(employeeId)
                .employeeName(employee.getName())
                .totalWeeklyHours(totalHours)
                .shifts(shiftResponses)
                .build();
    }
    
    public List<WeeklyHoursResponse> getAllEmployeesWeeklyHours() {
        LocalDateTime[] weekRange = getCurrentWeekRange();
        List<Shift> allShifts = shiftRepository.findAllShiftsByDateRange(
            weekRange[0], weekRange[1]
        );
        
        Map<Long, List<Shift>> shiftsByEmployee = allShifts.stream()
                .collect(Collectors.groupingBy(s -> s.getEmployee().getId()));
        
        List<Employee> allEmployees = employeeRepository.findAll();
        
        return allEmployees.stream()
                .filter(e -> e.getRole() == Employee.Role.EMPLOYEE)
                .map(employee -> {
                    List<Shift> employeeShifts = shiftsByEmployee.getOrDefault(
                        employee.getId(), 
                        new ArrayList<>()
                    );
                    
                    BigDecimal totalHours = employeeShifts.stream()
                            .filter(s -> s.getTotalHours() != null)
                            .map(Shift::getTotalHours)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
                    List<ShiftResponse> shiftResponses = employeeShifts.stream()
                            .map(this::mapToResponse)
                            .collect(Collectors.toList());
                    
                    return WeeklyHoursResponse.builder()
                            .employeeId(employee.getId())
                            .employeeName(employee.getName())
                            .totalWeeklyHours(totalHours)
                            .shifts(shiftResponses)
                            .build();
                })
                .collect(Collectors.toList());
    }
    
    private LocalDateTime[] getCurrentWeekRange() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY))
                .withHour(0).withMinute(0).withSecond(0).withNano(0);
        LocalDateTime endOfWeek = now.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY))
                .withHour(23).withMinute(59).withSecond(59).withNano(999999999);
        return new LocalDateTime[]{startOfWeek, endOfWeek};
    }
    
    private ShiftResponse mapToResponse(Shift shift) {
        return ShiftResponse.builder()
                .id(shift.getId())
                .employeeId(shift.getEmployee().getId())
                .employeeName(shift.getEmployee().getName())
                .clockIn(shift.getClockIn())
                .clockOut(shift.getClockOut())
                .totalHours(shift.getTotalHours())
                .build();
    }
}