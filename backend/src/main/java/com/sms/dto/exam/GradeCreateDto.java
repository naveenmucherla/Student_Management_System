package com.sms.dto.exam;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public class GradeCreateDto {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Exam ID is required")
    private Long examId;

    @NotNull(message = "Marks obtained is required")
    @PositiveOrZero(message = "Marks obtained must be 0 or positive")
    private Double marksObtained;

    private String remarks;

    public GradeCreateDto() {
    }

    public GradeCreateDto(Long studentId, Long examId, Double marksObtained, String remarks) {
        this.studentId = studentId;
        this.examId = examId;
        this.marksObtained = marksObtained;
        this.remarks = remarks;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public Double getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Double marksObtained) {
        this.marksObtained = marksObtained;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
