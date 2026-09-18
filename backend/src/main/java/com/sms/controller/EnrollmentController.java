package com.sms.controller;

import com.sms.dto.academic.EnrollmentRequestDto;
import com.sms.dto.academic.EnrollmentResponseDto;
import com.sms.service.AcademicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final AcademicService academicService;

    public EnrollmentController(AcademicService academicService) {
        this.academicService = academicService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<EnrollmentResponseDto>> getAllEnrollments() {
        return ResponseEntity.ok(academicService.getAllEnrollments());
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EnrollmentResponseDto>> getEnrollmentsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(academicService.getEnrollmentsByStudent(studentId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<EnrollmentResponseDto>> getEnrollmentsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(academicService.getEnrollmentsByCourse(courseId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EnrollmentResponseDto> enrollStudent(@Valid @RequestBody EnrollmentRequestDto dto) {
        EnrollmentResponseDto created = academicService.enrollStudent(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEnrollment(@PathVariable Long id) {
        academicService.deleteEnrollment(id);
        return ResponseEntity.noContent().build();
    }
}
