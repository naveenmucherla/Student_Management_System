package com.sms.service;

import com.sms.dto.academic.ClassSectionDto;
import com.sms.dto.academic.CourseDto;
import com.sms.dto.academic.EnrollmentRequestDto;
import com.sms.dto.academic.EnrollmentResponseDto;
import com.sms.exception.DuplicateResourceException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.model.ClassSection;
import com.sms.model.Course;
import com.sms.model.Enrollment;
import com.sms.model.Student;
import com.sms.repository.ClassSectionRepository;
import com.sms.repository.CourseRepository;
import com.sms.repository.EnrollmentRepository;
import com.sms.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AcademicService {

    private final CourseRepository courseRepository;
    private final ClassSectionRepository classSectionRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;

    public AcademicService(CourseRepository courseRepository,
                           ClassSectionRepository classSectionRepository,
                           EnrollmentRepository enrollmentRepository,
                           StudentRepository studentRepository) {
        this.courseRepository = courseRepository;
        this.classSectionRepository = classSectionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
    }

    // ================= Courses =================
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapCourseToDto)
                .collect(Collectors.toList());
    }

    public CourseDto getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + id));
        return mapCourseToDto(course);
    }

    @Transactional
    public CourseDto createCourse(CourseDto dto) {
        if (courseRepository.existsByCode(dto.getCode())) {
            throw new DuplicateResourceException("Course code '" + dto.getCode() + "' already exists");
        }

        Course course = new Course();
        course.setName(dto.getName());
        course.setCode(dto.getCode().toUpperCase().trim());
        course.setCredits(dto.getCredits());
        course.setDescription(dto.getDescription());

        Course saved = courseRepository.save(course);
        return mapCourseToDto(saved);
    }

    @Transactional
    public CourseDto updateCourse(Long id, CourseDto dto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + id));

        if (!course.getCode().equalsIgnoreCase(dto.getCode()) && courseRepository.existsByCode(dto.getCode())) {
            throw new DuplicateResourceException("Course code '" + dto.getCode() + "' already exists");
        }

        course.setName(dto.getName());
        course.setCode(dto.getCode().toUpperCase().trim());
        course.setCredits(dto.getCredits());
        course.setDescription(dto.getDescription());

        Course updated = courseRepository.save(course);
        return mapCourseToDto(updated);
    }

    @Transactional
    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with ID: " + id);
        }
        courseRepository.deleteById(id);
    }

    // ================= Class Sections =================
    public List<ClassSectionDto> getAllClassSections() {
        return classSectionRepository.findAll().stream()
                .map(this::mapClassSectionToDto)
                .collect(Collectors.toList());
    }

    public ClassSectionDto getClassSectionById(Long id) {
        ClassSection classSection = classSectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class Section not found with ID: " + id));
        return mapClassSectionToDto(classSection);
    }

    @Transactional
    public ClassSectionDto createClassSection(ClassSectionDto dto) {
        if (classSectionRepository.existsByNameAndAcademicYear(dto.getName(), dto.getAcademicYear())) {
            throw new DuplicateResourceException("Class section '" + dto.getName() + "' for year '" + dto.getAcademicYear() + "' already exists");
        }

        ClassSection classSection = new ClassSection();
        classSection.setName(dto.getName());
        classSection.setAcademicYear(dto.getAcademicYear());
        classSection.setRoomNumber(dto.getRoomNumber());

        ClassSection saved = classSectionRepository.save(classSection);
        return mapClassSectionToDto(saved);
    }

    @Transactional
    public ClassSectionDto updateClassSection(Long id, ClassSectionDto dto) {
        ClassSection classSection = classSectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class Section not found with ID: " + id));

        classSection.setName(dto.getName());
        classSection.setAcademicYear(dto.getAcademicYear());
        classSection.setRoomNumber(dto.getRoomNumber());

        ClassSection updated = classSectionRepository.save(classSection);
        return mapClassSectionToDto(updated);
    }

    @Transactional
    public void deleteClassSection(Long id) {
        if (!classSectionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Class Section not found with ID: " + id);
        }
        classSectionRepository.deleteById(id);
    }

    // ================= Enrollments =================
    public List<EnrollmentResponseDto> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(this::mapEnrollmentToDto)
                .collect(Collectors.toList());
    }

    public List<EnrollmentResponseDto> getEnrollmentsByStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentId);
        }
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(this::mapEnrollmentToDto)
                .collect(Collectors.toList());
    }

    public List<EnrollmentResponseDto> getEnrollmentsByCourse(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with ID: " + courseId);
        }
        return enrollmentRepository.findByCourseId(courseId).stream()
                .map(this::mapEnrollmentToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public EnrollmentResponseDto enrollStudent(EnrollmentRequestDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + dto.getStudentId()));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + dto.getCourseId()));

        if (enrollmentRepository.existsByStudentIdAndCourseIdAndAcademicYear(dto.getStudentId(), dto.getCourseId(), dto.getAcademicYear())) {
            throw new DuplicateResourceException("Student is already enrolled in this course for academic year " + dto.getAcademicYear());
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setAcademicYear(dto.getAcademicYear());
        enrollment.setEnrollmentDate(dto.getEnrollmentDate() != null ? dto.getEnrollmentDate() : LocalDate.now());

        Enrollment saved = enrollmentRepository.save(enrollment);
        return mapEnrollmentToDto(saved);
    }

    @Transactional
    public void deleteEnrollment(Long id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enrollment not found with ID: " + id);
        }
        enrollmentRepository.deleteById(id);
    }

    // ================= Mappings =================
    private CourseDto mapCourseToDto(Course course) {
        CourseDto dto = new CourseDto(course.getId(), course.getName(), course.getCode(), course.getCredits(), course.getDescription());
        dto.setEnrolledStudentsCount(enrollmentRepository.countByCourseId(course.getId()));
        return dto;
    }

    private ClassSectionDto mapClassSectionToDto(ClassSection section) {
        ClassSectionDto dto = new ClassSectionDto(section.getId(), section.getName(), section.getAcademicYear(), section.getRoomNumber());
        dto.setStudentCount(studentRepository.countByClassSectionId(section.getId()));
        return dto;
    }

    private EnrollmentResponseDto mapEnrollmentToDto(Enrollment enrollment) {
        EnrollmentResponseDto dto = new EnrollmentResponseDto();
        dto.setId(enrollment.getId());
        dto.setStudentId(enrollment.getStudent().getId());
        dto.setStudentName(enrollment.getStudent().getName());
        dto.setRollNumber(enrollment.getStudent().getRollNumber());
        dto.setCourseId(enrollment.getCourse().getId());
        dto.setCourseName(enrollment.getCourse().getName());
        dto.setCourseCode(enrollment.getCourse().getCode());
        dto.setCredits(enrollment.getCourse().getCredits());
        dto.setAcademicYear(enrollment.getAcademicYear());
        dto.setEnrollmentDate(enrollment.getEnrollmentDate());
        return dto;
    }
}
