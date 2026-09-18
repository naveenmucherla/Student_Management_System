package com.sms.service;

import com.sms.dto.attendance.AttendanceRecordDto;
import com.sms.dto.attendance.BulkAttendanceRequestDto;
import com.sms.dto.attendance.StudentAttendanceSummaryDto;
import com.sms.enums.AttendanceStatus;
import com.sms.exception.ResourceNotFoundException;
import com.sms.model.Attendance;
import com.sms.model.Course;
import com.sms.model.Student;
import com.sms.repository.AttendanceRepository;
import com.sms.repository.CourseRepository;
import com.sms.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             StudentRepository studentRepository,
                             CourseRepository courseRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public List<AttendanceRecordDto> saveBulkAttendance(BulkAttendanceRequestDto request) {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + request.getCourseId()));

        List<AttendanceRecordDto> savedList = new ArrayList<>();

        for (BulkAttendanceRequestDto.StudentAttendanceEntry entry : request.getEntries()) {
            Student student = studentRepository.findById(entry.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + entry.getStudentId()));

            Optional<Attendance> existing = attendanceRepository.findByStudentIdAndCourseIdAndDate(
                    student.getId(), course.getId(), request.getDate()
            );

            Attendance attendance;
            if (existing.isPresent()) {
                attendance = existing.get();
                attendance.setStatus(entry.getStatus());
                attendance.setRemarks(entry.getRemarks());
            } else {
                attendance = new Attendance();
                attendance.setStudent(student);
                attendance.setCourse(course);
                attendance.setDate(request.getDate());
                attendance.setStatus(entry.getStatus());
                attendance.setRemarks(entry.getRemarks());
            }

            Attendance saved = attendanceRepository.save(attendance);
            savedList.add(mapToDto(saved));
        }

        return savedList;
    }

    @Transactional
    public AttendanceRecordDto saveSingleAttendance(AttendanceRecordDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + dto.getStudentId()));

        Course course = courseRepository.findById(dto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + dto.getCourseId()));

        Optional<Attendance> existing = attendanceRepository.findByStudentIdAndCourseIdAndDate(
                student.getId(), course.getId(), dto.getDate()
        );

        Attendance attendance;
        if (existing.isPresent()) {
            attendance = existing.get();
            attendance.setStatus(dto.getStatus());
            attendance.setRemarks(dto.getRemarks());
        } else {
            attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setCourse(course);
            attendance.setDate(dto.getDate());
            attendance.setStatus(dto.getStatus());
            attendance.setRemarks(dto.getRemarks());
        }

        Attendance saved = attendanceRepository.save(attendance);
        return mapToDto(saved);
    }

    public List<AttendanceRecordDto> getStudentAttendanceHistory(Long studentId, LocalDate from, LocalDate to) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentId);
        }
        return attendanceRepository.findByStudentIdAndDateRange(studentId, from, to).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AttendanceRecordDto> getClassAttendanceForDate(Long classSectionId, LocalDate date) {
        return attendanceRepository.findByClassSectionIdAndDate(classSectionId, date).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<AttendanceRecordDto> getCourseAttendanceForDate(Long courseId, LocalDate date) {
        return attendanceRepository.findByCourseIdAndDate(courseId, date).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StudentAttendanceSummaryDto getStudentAttendancePercentage(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        long total = attendanceRepository.countByStudentId(studentId);
        long present = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.PRESENT);
        long absent = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.ABSENT);
        long late = attendanceRepository.countByStudentIdAndStatus(studentId, AttendanceStatus.LATE);

        // Attendance formula: (Present + 0.5 * Late) / Total * 100
        double percentage = total > 0 ? ((present + (late * 0.5)) / (double) total) * 100 : 0.0;
        percentage = Math.round(percentage * 100.0) / 100.0;

        return new StudentAttendanceSummaryDto(
                student.getId(),
                student.getName(),
                student.getRollNumber(),
                total,
                present,
                absent,
                late,
                percentage
        );
    }

    private AttendanceRecordDto mapToDto(Attendance attendance) {
        return new AttendanceRecordDto(
                attendance.getId(),
                attendance.getStudent().getId(),
                attendance.getStudent().getName(),
                attendance.getStudent().getRollNumber(),
                attendance.getCourse().getId(),
                attendance.getCourse().getName(),
                attendance.getDate(),
                attendance.getStatus(),
                attendance.getRemarks()
        );
    }
}
