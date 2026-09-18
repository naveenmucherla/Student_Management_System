package com.sms.controller;

import com.sms.dto.exam.ExamDto;
import com.sms.service.ExamGradeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    private final ExamGradeService examGradeService;

    public ExamController(ExamGradeService examGradeService) {
        this.examGradeService = examGradeService;
    }

    @GetMapping
    public ResponseEntity<List<ExamDto>> getAllExams() {
        return ResponseEntity.ok(examGradeService.getAllExams());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExamDto> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(examGradeService.getExamById(id));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<ExamDto>> getExamsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(examGradeService.getExamsByCourse(courseId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ExamDto> createExam(@Valid @RequestBody ExamDto dto) {
        ExamDto created = examGradeService.createExam(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examGradeService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }
}
