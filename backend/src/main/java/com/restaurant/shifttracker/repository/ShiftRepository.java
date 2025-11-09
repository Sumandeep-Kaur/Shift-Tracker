package com.restaurant.shifttracker.repository;

import com.restaurant.shifttracker.entity.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    
    @Query("SELECT s FROM Shift s WHERE s.employee.id = :employeeId AND s.clockOut IS NULL")
    Optional<Shift> findActiveShiftByEmployeeId(@Param("employeeId") Long employeeId);
    
    @Query("SELECT s FROM Shift s WHERE s.employee.id = :employeeId AND s.clockIn >= :startDate AND s.clockIn <= :endDate ORDER BY s.clockIn DESC")
    List<Shift> findShiftsByEmployeeAndDateRange(
        @Param("employeeId") Long employeeId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT s FROM Shift s WHERE s.clockIn >= :startDate AND s.clockIn <= :endDate ORDER BY s.employee.id, s.clockIn DESC")
    List<Shift> findAllShiftsByDateRange(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}