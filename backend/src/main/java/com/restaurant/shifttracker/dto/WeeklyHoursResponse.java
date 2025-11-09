package com.restaurant.shifttracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyHoursResponse {
    private Long employeeId;
    private String employeeName;
    private BigDecimal totalWeeklyHours;
    private List<ShiftResponse> shifts;
}