package com.sms.dto.attendance;

import com.sms.enums.AttendanceStatus;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class BulkAttendanceRequestDto {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotEmpty(message = "Student attendance entries cannot be empty")
    private List<StudentAttendanceEntry> entries;

    public static class StudentAttendanceEntry {
        @NotNull(message = "Student ID is required")
        private Long studentId;

        @NotNull(message = "Status is required")
        private AttendanceStatus status;

        private String remarks;

        public StudentAttendanceEntry() {
        }

        public StudentAttendanceEntry(Long studentId, AttendanceStatus status, String remarks) {
            this.studentId = studentId;
            this.status = status;
            this.remarks = remarks;
        }

        public Long getStudentId() {
            return studentId;
        }

        public void setStudentId(Long studentId) {
            this.studentId = studentId;
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

    public BulkAttendanceRequestDto() {
    }

    public BulkAttendanceRequestDto(Long courseId, LocalDate date, List<StudentAttendanceEntry> entries) {
        this.courseId = courseId;
        this.date = date;
        this.entries = entries;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<StudentAttendanceEntry> getEntries() {
        return entries;
    }

    public void setEntries(List<StudentAttendanceEntry> entries) {
        this.entries = entries;
    }
}
