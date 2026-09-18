package com.sms.dto.academic;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CourseDto {

    private Long id;

    @NotBlank(message = "Course name is required")
    private String name;

    @NotBlank(message = "Course code is required")
    private String code;

    @NotNull(message = "Credits are required")
    @Min(value = 1, message = "Credits must be at least 1")
    private Integer credits;

    private String description;
    private Long enrolledStudentsCount;

    public CourseDto() {
    }

    public CourseDto(Long id, String name, String code, Integer credits, String description) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.credits = credits;
        this.description = description;
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

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getCredits() {
        return credits;
    }

    public void setCredits(Integer credits) {
        this.credits = credits;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getEnrolledStudentsCount() {
        return enrolledStudentsCount;
    }

    public void setEnrolledStudentsCount(Long enrolledStudentsCount) {
        this.enrolledStudentsCount = enrolledStudentsCount;
    }
}
