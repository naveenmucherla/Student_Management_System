package com.sms.controller;

import com.sms.dto.exam.*;
import com.sms.service.ExamGradeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final ExamGradeService examGradeService;

    public GradeController(ExamGradeService examGradeService) {
        this.examGradeService = examGradeService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<GradeDto> recordGrade(@Valid @RequestBody GradeCreateDto dto) {
        GradeDto created = examGradeService.recordGrade(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/bulk")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<GradeDto>> recordBulkGrades(@Valid @RequestBody List<GradeCreateDto> gradeList) {
        List<GradeDto> result = examGradeService.recordBulkGrades(gradeList);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<GradeDto>> getGradesByExam(@PathVariable Long examId) {
        return ResponseEntity.ok(examGradeService.getGradesByExam(examId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<StudentTranscriptDto> getStudentTranscript(@PathVariable Long studentId) {
        StudentTranscriptDto transcript = examGradeService.getStudentTranscript(studentId);
        return ResponseEntity.ok(transcript);
    }

    @GetMapping("/student/{studentId}/gpa")
    public ResponseEntity<GpaDto> getStudentGpa(@PathVariable Long studentId) {
        GpaDto gpa = examGradeService.calculateGpa(studentId);
        return ResponseEntity.ok(gpa);
    }
}
