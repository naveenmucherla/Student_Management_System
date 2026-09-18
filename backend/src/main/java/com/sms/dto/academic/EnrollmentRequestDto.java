package com.sms.dto.academic;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class EnrollmentRequestDto {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    private LocalDate enrollmentDate;

    public EnrollmentRequestDto() {
    }

    public EnrollmentRequestDto(Long studentId, Long courseId, String academicYear, LocalDate enrollmentDate) {
        this.studentId = studentId;
        this.courseId = courseId;
        this.academicYear = academicYear;
        this.enrollmentDate = enrollmentDate;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }
}
