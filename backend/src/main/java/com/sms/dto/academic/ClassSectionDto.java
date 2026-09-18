package com.sms.dto.academic;

import jakarta.validation.constraints.NotBlank;

public class ClassSectionDto {

    private Long id;

    @NotBlank(message = "Class section name is required")
    private String name;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    private String roomNumber;
    private Long studentCount;

    public ClassSectionDto() {
    }

    public ClassSectionDto(Long id, String name, String academicYear, String roomNumber) {
        this.id = id;
        this.name = name;
        this.academicYear = academicYear;
        this.roomNumber = roomNumber;
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

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Long getStudentCount() {
        return studentCount;
    }

    public void setStudentCount(Long studentCount) {
        this.studentCount = studentCount;
    }
}
