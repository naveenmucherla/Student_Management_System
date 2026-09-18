package com.sms.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "enrollments",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"student_id", "course_id", "academic_year"})})
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(name = "enrollment_date")
    private LocalDate enrollmentDate;

    public Enrollment() {
    }

    public Enrollment(Long id, Student student, Course course, String academicYear, LocalDate enrollmentDate) {
        this.id = id;
        this.student = student;
        this.course = course;
        this.academicYear = academicYear;
        this.enrollmentDate = enrollmentDate != null ? enrollmentDate : LocalDate.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public LocalDate getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(LocalDate enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }
}
