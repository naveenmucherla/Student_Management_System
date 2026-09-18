package com.sms.service;

import com.sms.dto.exam.*;
import com.sms.exception.ResourceNotFoundException;
import com.sms.model.Course;
import com.sms.model.Exam;
import com.sms.model.Grade;
import com.sms.model.Student;
import com.sms.repository.CourseRepository;
import com.sms.repository.ExamRepository;
import com.sms.repository.GradeRepository;
import com.sms.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ExamGradeService {

    private final ExamRepository examRepository;
    private final GradeRepository gradeRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    public ExamGradeService(ExamRepository examRepository,
                            GradeRepository gradeRepository,
                            CourseRepository courseRepository,
                            StudentRepository studentRepository) {
        this.examRepository = examRepository;
        this.gradeRepository = gradeRepository;
        this.courseRepository = courseRepository;
        this.studentRepository = studentRepository;
    }

    // ================= Exams =================
    public List<ExamDto> getAllExams() {
        return examRepository.findAll().stream()
                .map(this::mapExamToDto)
                .collect(Collectors.toList());
    }

    public List<ExamDto> getExamsByCourse(Long courseId) {
        return examRepository.findByCourseId(courseId).stream()
                .map(this::mapExamToDto)
                .collect(Collectors.toList());
    }

    public ExamDto getExamById(Long id) {
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with ID: " + id));
        return mapExamToDto(exam);
    }

    @Transactional
    public ExamDto createExam(ExamDto dto) {
        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + dto.getCourseId()));

        Exam exam = new Exam();
        exam.setName(dto.getName());
        exam.setCourse(course);
        exam.setDate(dto.getDate());
        exam.setMaxMarks(dto.getMaxMarks());

        Exam saved = examRepository.save(exam);
        return mapExamToDto(saved);
    }

    @Transactional
    public void deleteExam(Long id) {
        if (!examRepository.existsById(id)) {
            throw new ResourceNotFoundException("Exam not found with ID: " + id);
        }
        examRepository.deleteById(id);
    }

    // ================= Grades =================
    @Transactional
    public GradeDto recordGrade(GradeCreateDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + dto.getStudentId()));

        Exam exam = examRepository.findById(dto.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found with ID: " + dto.getExamId()));

        Optional<Grade> existing = gradeRepository.findByStudentIdAndExamId(dto.getStudentId(), dto.getExamId());

        Grade grade;
        if (existing.isPresent()) {
            grade = existing.get();
            grade.setMarksObtained(dto.getMarksObtained());
            grade.setRemarks(dto.getRemarks());
        } else {
            grade = new Grade();
            grade.setStudent(student);
            grade.setExam(exam);
            grade.setMarksObtained(dto.getMarksObtained());
            grade.setRemarks(dto.getRemarks());
        }

        Grade saved = gradeRepository.save(grade);
        return mapGradeToDto(saved);
    }

    @Transactional
    public List<GradeDto> recordBulkGrades(List<GradeCreateDto> gradeList) {
        List<GradeDto> results = new ArrayList<>();
        for (GradeCreateDto dto : gradeList) {
            results.add(recordGrade(dto));
        }
        return results;
    }

    public List<GradeDto> getGradesByExam(Long examId) {
        return gradeRepository.findByExamId(examId).stream()
                .map(this::mapGradeToDto)
                .collect(Collectors.toList());
    }

    public List<GradeDto> getGradesByStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentId);
        }
        return gradeRepository.findByStudentId(studentId).stream()
                .map(this::mapGradeToDto)
                .collect(Collectors.toList());
    }

    public StudentTranscriptDto getStudentTranscript(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        List<GradeDto> gradeDtos = grades.stream().map(this::mapGradeToDto).collect(Collectors.toList());

        GpaDto gpaDto = calculateGpa(studentId);

        StudentTranscriptDto transcript = new StudentTranscriptDto();
        transcript.setStudentId(student.getId());
        transcript.setStudentName(student.getName());
        transcript.setRollNumber(student.getRollNumber());
        if (student.getClassSection() != null) {
            transcript.setClassSectionName(student.getClassSection().getName());
            transcript.setAcademicYear(student.getClassSection().getAcademicYear());
        }
        transcript.setGpa(gpaDto.getGpa());
        transcript.setTotalCredits(gpaDto.getTotalCredits());
        transcript.setGrades(gradeDtos);

        return transcript;
    }

    public GpaDto calculateGpa(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        List<Grade> grades = gradeRepository.findByStudentId(studentId);
        if (grades.isEmpty()) {
            return new GpaDto(student.getId(), student.getName(), student.getRollNumber(), 0.0, 0, 0);
        }

        double totalWeightedPoints = 0.0;
        int totalCredits = 0;

        for (Grade g : grades) {
            int credits = g.getExam().getCourse().getCredits();
            double percentage = (g.getMarksObtained() / g.getExam().getMaxMarks()) * 100.0;
            double gradePoint = calculateGradePoint(percentage);

            totalWeightedPoints += (gradePoint * credits);
            totalCredits += credits;
        }

        double gpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits) : 0.0;
        gpa = Math.round(gpa * 100.0) / 100.0;

        return new GpaDto(student.getId(), student.getName(), student.getRollNumber(), gpa, totalCredits, grades.size());
    }

    public static double calculateGradePoint(double percentage) {
        if (percentage >= 90) return 4.0;
        if (percentage >= 80) return 3.5;
        if (percentage >= 70) return 3.0;
        if (percentage >= 60) return 2.5;
        if (percentage >= 50) return 2.0;
        if (percentage >= 40) return 1.5;
        return 0.0;
    }

    public static String calculateLetterGrade(double percentage) {
        if (percentage >= 90) return "A+";
        if (percentage >= 80) return "A";
        if (percentage >= 70) return "B+";
        if (percentage >= 60) return "B";
        if (percentage >= 50) return "C";
        if (percentage >= 40) return "D";
        return "F";
    }

    private ExamDto mapExamToDto(Exam exam) {
        return new ExamDto(
                exam.getId(),
                exam.getName(),
                exam.getCourse().getId(),
                exam.getCourse().getName(),
                exam.getCourse().getCode(),
                exam.getDate(),
                exam.getMaxMarks()
        );
    }

    private GradeDto mapGradeToDto(Grade grade) {
        GradeDto dto = new GradeDto();
        dto.setId(grade.getId());
        dto.setStudentId(grade.getStudent().getId());
        dto.setStudentName(grade.getStudent().getName());
        dto.setRollNumber(grade.getStudent().getRollNumber());
        dto.setExamId(grade.getExam().getId());
        dto.setExamName(grade.getExam().getName());
        dto.setCourseId(grade.getExam().getCourse().getId());
        dto.setCourseName(grade.getExam().getCourse().getName());
        dto.setCourseCode(grade.getExam().getCourse().getCode());
        dto.setCredits(grade.getExam().getCourse().getCredits());
        dto.setMarksObtained(grade.getMarksObtained());
        dto.setMaxMarks(grade.getExam().getMaxMarks());

        double percentage = (grade.getMarksObtained() / grade.getExam().getMaxMarks()) * 100.0;
        dto.setPercentage(Math.round(percentage * 100.0) / 100.0);
        dto.setLetterGrade(calculateLetterGrade(percentage));
        dto.setGradePoint(calculateGradePoint(percentage));
        dto.setRemarks(grade.getRemarks());

        return dto;
    }
}
