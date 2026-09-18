package com.sms.dto.faculty;

import jakarta.validation.constraints.NotBlank;

public class FacultyRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    private String contact;
    private String department;
    private Long userId;

    public FacultyRequestDto() {
    }

    public FacultyRequestDto(String name, String contact, String department, Long userId) {
        this.name = name;
        this.contact = contact;
        this.department = department;
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
