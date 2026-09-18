package com.sms;

import com.sms.dto.attendance.StudentAttendanceSummaryDto;
import com.sms.dto.auth.AuthResponse;
import com.sms.dto.auth.LoginRequest;
import com.sms.dto.dashboard.DashboardSummaryDto;
import com.sms.dto.exam.GpaDto;
import com.sms.dto.student.StudentResponseDto;
import com.sms.service.AttendanceService;
import com.sms.service.AuthService;
import com.sms.service.DashboardService;
import com.sms.service.ExamGradeService;
import com.sms.service.StudentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("h2")
class AuthAndStudentServiceTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private ExamGradeService examGradeService;

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private DashboardService dashboardService;

    @Test
    void testAdminLogin() {
        LoginRequest request = new LoginRequest("admin", "admin123");
        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("admin", response.getUsername());
    }

    @Test
    void testGetAllStudents() {
        List<StudentResponseDto> students = studentService.getAllStudents();
        assertNotNull(students);
        assertTrue(students.size() >= 5);
    }

    @Test
    void testGpaCalculation() {
        List<StudentResponseDto> students = studentService.getAllStudents();
        assertFalse(students.isEmpty());
        Long studentId = students.get(0).getId();

        GpaDto gpa = examGradeService.calculateGpa(studentId);
        assertNotNull(gpa);
        assertTrue(gpa.getGpa() > 0.0);
    }

    @Test
    void testAttendanceCalculation() {
        List<StudentResponseDto> students = studentService.getAllStudents();
        assertFalse(students.isEmpty());
        Long studentId = students.get(0).getId();

        StudentAttendanceSummaryDto summary = attendanceService.getStudentAttendancePercentage(studentId);
        assertNotNull(summary);
        assertTrue(summary.getTotalClasses() > 0);
        assertTrue(summary.getPercentage() >= 0.0);
    }

    @Test
    void testDashboardSummary() {
        DashboardSummaryDto summary = dashboardService.getDashboardSummary();
        assertNotNull(summary);
        assertTrue(summary.getTotalStudents() >= 5);
        assertTrue(summary.getTotalCourses() >= 5);
        assertTrue(summary.getWeeklyAttendanceRate() > 0);
    }
}
