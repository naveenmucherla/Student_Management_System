package com.sms.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "roll_number", nullable = false, unique = true, length = 50)
    private String rollNumber;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(length = 30)
    private String contact;

    @Column(length = 255)
    private String address;

    @Column(name = "guardian_name", length = 100)
    private String guardianName;

    @Column(name = "guardian_contact", length = 30)
    private String guardianContact;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_section_id")
    private ClassSection classSection;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    public Student() {
    }

    public Student(Long id, String name, String rollNumber, LocalDate dob, String contact, String address,
                   String guardianName, String guardianContact, LocalDate enrollmentDate,
                   ClassSection classSection, User user) {
        this.id = id;
        this.name = name;
        this.rollNumber = rollNumber;
        this.dob = dob;
        this.contact = contact;
        this.address = address;
        this.guardianName = guardianName;
        this.guardianContact = guardianContact;
        this.enrollmentDate = enrollmentDate;
        this.classSection = classSection;
        this.user = user;
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

    public ClassSection getClassSection() {
        return classSection;
    }

    public void setClassSection(ClassSection classSection) {
        this.classSection = classSection;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
