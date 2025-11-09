package com.restaurant.shifttracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private LocalDateTime clockIn;
    private LocalDateTime clockOut;
    private BigDecimal totalHours;
}