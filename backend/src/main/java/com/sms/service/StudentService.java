package com.sms.service;

import com.sms.dto.student.StudentRequestDto;
import com.sms.dto.student.StudentResponseDto;
import com.sms.exception.DuplicateResourceException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.model.ClassSection;
import com.sms.model.Student;
import com.sms.model.User;
import com.sms.repository.ClassSectionRepository;
import com.sms.repository.StudentRepository;
import com.sms.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final ClassSectionRepository classSectionRepository;
    private final UserRepository userRepository;

    public StudentService(StudentRepository studentRepository,
                          ClassSectionRepository classSectionRepository,
                          UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.classSectionRepository = classSectionRepository;
        this.userRepository = userRepository;
    }

    public List<StudentResponseDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Page<StudentResponseDto> getStudentsPaged(String query, Long classSectionId, Pageable pageable) {
        String searchQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;
        return studentRepository.findByFilters(searchQuery, classSectionId, pageable)
                .map(this::mapToDto);
    }

    public List<StudentResponseDto> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.searchStudents(query.trim()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StudentResponseDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));
        return mapToDto(student);
    }

    public List<StudentResponseDto> getStudentsByClassSection(Long classSectionId) {
        return studentRepository.findByClassSectionId(classSectionId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentResponseDto createStudent(StudentRequestDto dto) {
        if (studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new DuplicateResourceException("Roll number '" + dto.getRollNumber() + "' is already in use");
        }

        ClassSection classSection = classSectionRepository.findById(dto.getClassSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Class Section not found with ID: " + dto.getClassSectionId()));

        User user = null;
        if (dto.getUserId() != null) {
            user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));
        }

        Student student = new Student();
        student.setName(dto.getName());
        student.setRollNumber(dto.getRollNumber());
        student.setDob(dto.getDob());
        student.setContact(dto.getContact());
        student.setAddress(dto.getAddress());
        student.setGuardianName(dto.getGuardianName());
        student.setGuardianContact(dto.getGuardianContact());
        student.setEnrollmentDate(dto.getEnrollmentDate());
        student.setClassSection(classSection);
        student.setUser(user);

        Student saved = studentRepository.save(student);
        return mapToDto(saved);
    }

    @Transactional
    public StudentResponseDto updateStudent(Long id, StudentRequestDto dto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + id));

        if (!student.getRollNumber().equalsIgnoreCase(dto.getRollNumber())
                && studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new DuplicateResourceException("Roll number '" + dto.getRollNumber() + "' is already in use");
        }

        ClassSection classSection = classSectionRepository.findById(dto.getClassSectionId())
                .orElseThrow(() -> new ResourceNotFoundException("Class Section not found with ID: " + dto.getClassSectionId()));

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));
            student.setUser(user);
        }

        student.setName(dto.getName());
        student.setRollNumber(dto.getRollNumber());
        student.setDob(dto.getDob());
        student.setContact(dto.getContact());
        student.setAddress(dto.getAddress());
        student.setGuardianName(dto.getGuardianName());
        student.setGuardianContact(dto.getGuardianContact());
        student.setEnrollmentDate(dto.getEnrollmentDate());
        student.setClassSection(classSection);

        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    public StudentResponseDto mapToDto(Student student) {
        StudentResponseDto dto = new StudentResponseDto();
        dto.setId(student.getId());
        dto.setName(student.getName());
        dto.setRollNumber(student.getRollNumber());
        dto.setDob(student.getDob());
        dto.setContact(student.getContact());
        dto.setAddress(student.getAddress());
        dto.setGuardianName(student.getGuardianName());
        dto.setGuardianContact(student.getGuardianContact());
        dto.setEnrollmentDate(student.getEnrollmentDate());

        if (student.getClassSection() != null) {
            dto.setClassSectionId(student.getClassSection().getId());
            dto.setClassSectionName(student.getClassSection().getName());
            dto.setAcademicYear(student.getClassSection().getAcademicYear());
        }

        if (student.getUser() != null) {
            dto.setUserId(student.getUser().getId());
            dto.setUsername(student.getUser().getUsername());
            dto.setEmail(student.getUser().getEmail());
        }

        return dto;
    }
}
