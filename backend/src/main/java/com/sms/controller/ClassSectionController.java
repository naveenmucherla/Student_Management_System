package com.sms.controller;

import com.sms.dto.academic.ClassSectionDto;
import com.sms.service.AcademicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/class-sections")
public class ClassSectionController {

    private final AcademicService academicService;

    public ClassSectionController(AcademicService academicService) {
        this.academicService = academicService;
    }

    @GetMapping
    public ResponseEntity<List<ClassSectionDto>> getAllClassSections() {
        return ResponseEntity.ok(academicService.getAllClassSections());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassSectionDto> getClassSectionById(@PathVariable Long id) {
        return ResponseEntity.ok(academicService.getClassSectionById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassSectionDto> createClassSection(@Valid @RequestBody ClassSectionDto dto) {
        ClassSectionDto created = academicService.createClassSection(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassSectionDto> updateClassSection(@PathVariable Long id, @Valid @RequestBody ClassSectionDto dto) {
        ClassSectionDto updated = academicService.updateClassSection(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteClassSection(@PathVariable Long id) {
        academicService.deleteClassSection(id);
        return ResponseEntity.noContent().build();
    }
}
