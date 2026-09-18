package com.sms.service;

import com.sms.dto.timetable.TimetableDto;
import com.sms.exception.ResourceNotFoundException;
import com.sms.model.ClassSection;
import com.sms.model.Course;
import com.sms.model.Faculty;
import com.sms.model.Timetable;
import com.sms.repository.ClassSectionRepository;
import com.sms.repository.CourseRepository;
import com.sms.repository.FacultyRepository;
import com.sms.repository.TimetableRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimetableService {

    private final TimetableRepository timetableRepository;
    private final ClassSectionRepository classSectionRepository;
    private final CourseRepository courseRepository;
    private final FacultyRepository facultyRepository;

    public TimetableService(TimetableRepository timetableRepository,
                            ClassSectionRepository classSectionRepository,
                            CourseRepository courseRepository,
                            FacultyRepository facultyRepository) {
        this.timetableRepository = timetableRepository;
        this.classSectionRepository = classSectionRepository;
        this.courseRepository = courseRepository;
        this.facultyRepository = facultyRepository;
    }

    public List<TimetableDto> getAllTimetableSlots() {
        return timetableRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<TimetableDto> getTimetableByClassSection(Long classSectionId) {
        return timetableRepository.findByClassSectionId(classSectionId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<TimetableDto> getTimetableByFaculty(Long facultyId) {
        return timetableRepository.findByFacultyId(facultyId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TimetableDto getTimetableById(Long id) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable slot not found with ID: " + id));
        return mapToDto(timetable);
    }

    @Transactional
    public TimetableDto createTimetableSlot(TimetableDto dto) {
        ClassSection classSection = classSectionRepository.findById(dto.getClassSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Class Section not found with ID: " + dto.getClassSectionId()));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + dto.getCourseId()));

        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + dto.getFacultyId()));

        Timetable timetable = new Timetable();
        timetable.setClassSection(classSection);
        timetable.setCourse(course);
        timetable.setFaculty(faculty);
        timetable.setDayOfWeek(dto.getDayOfWeek());
        timetable.setStartTime(dto.getStartTime());
        timetable.setEndTime(dto.getEndTime());
        timetable.setRoom(dto.getRoom());

        Timetable saved = timetableRepository.save(timetable);
        return mapToDto(saved);
    }

    @Transactional
    public TimetableDto updateTimetableSlot(Long id, TimetableDto dto) {
        Timetable timetable = timetableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable slot not found with ID: " + id));

        ClassSection classSection = classSectionRepository.findById(dto.getClassSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Class Section not found with ID: " + dto.getClassSectionId()));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + dto.getCourseId()));

        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + dto.getFacultyId()));

        timetable.setClassSection(classSection);
        timetable.setCourse(course);
        timetable.setFaculty(faculty);
        timetable.setDayOfWeek(dto.getDayOfWeek());
        timetable.setStartTime(dto.getStartTime());
        timetable.setEndTime(dto.getEndTime());
        timetable.setRoom(dto.getRoom());

        Timetable updated = timetableRepository.save(timetable);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteTimetableSlot(Long id) {
        if (!timetableRepository.existsById(id)) {
            throw new ResourceNotFoundException("Timetable slot not found with ID: " + id);
        }
        timetableRepository.deleteById(id);
    }

    private TimetableDto mapToDto(Timetable t) {
        TimetableDto dto = new TimetableDto();
        dto.setId(t.getId());
        dto.setClassSectionId(t.getClassSection().getId());
        dto.setClassSectionName(t.getClassSection().getName());
        dto.setCourseId(t.getCourse().getId());
        dto.setCourseName(t.getCourse().getName());
        dto.setCourseCode(t.getCourse().getCode());
        dto.setFacultyId(t.getFaculty().getId());
        dto.setFacultyName(t.getFaculty().getName());
        dto.setDayOfWeek(t.getDayOfWeek());
        dto.setStartTime(t.getStartTime());
        dto.setEndTime(t.getEndTime());
        dto.setRoom(t.getRoom());
        return dto;
    }
}
