package com.sms.dto.exam;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public class ExamDto {

    private Long id;

    @NotBlank(message = "Exam name is required")
    private String name;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private String courseName;
    private String courseCode;

    @NotNull(message = "Exam date is required")
    private LocalDate date;

    @NotNull(message = "Max marks is required")
    @Positive(message = "Max marks must be greater than 0")
    private Double maxMarks;

    public ExamDto() {
    }

    public ExamDto(Long id, String name, Long courseId, String courseName, String courseCode, LocalDate date, Double maxMarks) {
        this.id = id;
        this.name = name;
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseCode = courseCode;
        this.date = date;
        this.maxMarks = maxMarks;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(Double maxMarks) {
        this.maxMarks = maxMarks;
    }
}
