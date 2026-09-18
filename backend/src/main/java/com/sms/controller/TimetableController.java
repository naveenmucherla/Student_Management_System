package com.sms.controller;

import com.sms.dto.timetable.TimetableDto;
import com.sms.service.TimetableService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @GetMapping
    public ResponseEntity<List<TimetableDto>> getAllTimetableSlots(
            @RequestParam(required = false) Long classSectionId,
            @RequestParam(required = false) Long facultyId) {

        if (classSectionId != null) {
            return ResponseEntity.ok(timetableService.getTimetableByClassSection(classSectionId));
        } else if (facultyId != null) {
            return ResponseEntity.ok(timetableService.getTimetableByFaculty(facultyId));
        }
        return ResponseEntity.ok(timetableService.getAllTimetableSlots());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimetableDto> getTimetableById(@PathVariable Long id) {
        return ResponseEntity.ok(timetableService.getTimetableById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TimetableDto> createTimetableSlot(@Valid @RequestBody TimetableDto dto) {
        TimetableDto created = timetableService.createTimetableSlot(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TimetableDto> updateTimetableSlot(@PathVariable Long id, @Valid @RequestBody TimetableDto dto) {
        TimetableDto updated = timetableService.updateTimetableSlot(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTimetableSlot(@PathVariable Long id) {
        timetableService.deleteTimetableSlot(id);
        return ResponseEntity.noContent().build();
    }
}
