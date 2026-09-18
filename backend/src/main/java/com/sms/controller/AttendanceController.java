package com.sms.controller;

import com.sms.dto.attendance.AttendanceRecordDto;
import com.sms.dto.attendance.BulkAttendanceRequestDto;
import com.sms.dto.attendance.StudentAttendanceSummaryDto;
import com.sms.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<AttendanceRecordDto>> markBulkAttendance(@Valid @RequestBody BulkAttendanceRequestDto request) {
        List<AttendanceRecordDto> records = attendanceService.saveBulkAttendance(request);
        return ResponseEntity.ok(records);
    }

    @PostMapping("/single")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<AttendanceRecordDto> markSingleAttendance(@Valid @RequestBody AttendanceRecordDto dto) {
        AttendanceRecordDto record = attendanceService.saveSingleAttendance(dto);
        return ResponseEntity.ok(record);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceRecordDto>> getStudentAttendance(
            @PathVariable Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        List<AttendanceRecordDto> history = attendanceService.getStudentAttendanceHistory(studentId, from, to);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/class/{classSectionId}/date/{date}")
    public ResponseEntity<List<AttendanceRecordDto>> getClassAttendance(
            @PathVariable Long classSectionId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceRecordDto> records = attendanceService.getClassAttendanceForDate(classSectionId, date);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/course/{courseId}/date/{date}")
    public ResponseEntity<List<AttendanceRecordDto>> getCourseAttendance(
            @PathVariable Long courseId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AttendanceRecordDto> records = attendanceService.getCourseAttendanceForDate(courseId, date);
        return ResponseEntity.ok(records);
    }

    @GetMapping("/student/{studentId}/percentage")
    public ResponseEntity<StudentAttendanceSummaryDto> getStudentPercentage(@PathVariable Long studentId) {
        StudentAttendanceSummaryDto summary = attendanceService.getStudentAttendancePercentage(studentId);
        return ResponseEntity.ok(summary);
    }
}
