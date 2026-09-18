package com.sms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "class_sections")
public class ClassSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String name; // e.g., "Grade 10-A", "CSE-3A"

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear; // e.g., "2025-2026"

    @Column(name = "room_number", length = 30)
    private String roomNumber;

    public ClassSection() {
    }

    public ClassSection(Long id, String name, String academicYear, String roomNumber) {
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
}
