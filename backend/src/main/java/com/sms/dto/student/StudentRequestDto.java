package com.sms.dto.student;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class StudentRequestDto {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    private LocalDate dob;
    private String contact;
    private String address;
    private String guardianName;
    private String guardianContact;
    private LocalDate enrollmentDate;

    @NotNull(message = "Class section ID is required")
    private Long classSectionId;

    private Long userId;

    public StudentRequestDto() {
    }

    public StudentRequestDto(String name, String rollNumber, LocalDate dob, String contact, String address,
                             String guardianName, String guardianContact, LocalDate enrollmentDate,
                             Long classSectionId, Long userId) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.dob = dob;
        this.contact = contact;
        this.address = address;
        this.guardianName = guardianName;
        this.guardianContact = guardianContact;
        this.enrollmentDate = enrollmentDate;
        this.classSectionId = classSectionId;
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianContact() {
        return guardianContact;
    }

    public void setGuardianContact(String guardianContact) {
        this.guardianContact = guardianContact;
    }

    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public Long getClassSectionId() {
        return classSectionId;
    }

    public void setClassSectionId(Long classSectionId) {
        this.classSectionId = classSectionId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
