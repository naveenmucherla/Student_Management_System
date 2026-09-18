package com.sms.controller;

import com.sms.dto.student.StudentRequestDto;
import com.sms.dto.student.StudentResponseDto;
import com.sms.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentResponseDto>> getAllStudents() {
        List<StudentResponseDto> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<StudentResponseDto>> getStudentsPaged(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Long classSectionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<StudentResponseDto> result = studentService.getStudentsPaged(query, classSectionId, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/search")
    public ResponseEntity<List<StudentResponseDto>> searchStudents(@RequestParam(name = "query", required = false) String query) {
        List<StudentResponseDto> result = studentService.searchStudents(query);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponseDto> getStudentById(@PathVariable Long id) {
        StudentResponseDto student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @GetMapping("/class/{classSectionId}")
    public ResponseEntity<List<StudentResponseDto>> getStudentsByClassSection(@PathVariable Long classSectionId) {
        List<StudentResponseDto> students = studentService.getStudentsByClassSection(classSectionId);
        return ResponseEntity.ok(students);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponseDto> createStudent(@Valid @RequestBody StudentRequestDto dto) {
        StudentResponseDto created = studentService.createStudent(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentResponseDto> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentRequestDto dto) {
        StudentResponseDto updated = studentService.updateStudent(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
