package com.sms.dto.attendance;

import com.sms.enums.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AttendanceRecordDto {

    private Long id;

    @NotNull(message = "Student ID is required")
    private Long studentId;

    private String studentName;
    private String rollNumber;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private String courseName;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Attendance status is required")
    private AttendanceStatus status;

    private String remarks;

    public AttendanceRecordDto() {
    }

    public AttendanceRecordDto(Long id, Long studentId, String studentName, String rollNumber,
                               Long courseId, String courseName, LocalDate date,
                               AttendanceStatus status, String remarks) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.courseId = courseId;
        this.courseName = courseName;
        this.date = date;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
