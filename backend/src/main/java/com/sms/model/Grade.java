package com.sms.model;

import jakarta.persistence.*;

@Entity
@Table(name = "grades",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"student_id", "exam_id"})})
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(name = "marks_obtained", nullable = false)
    private Double marksObtained;

    @Column(length = 255)
    private String remarks;

    public Grade() {
    }

    public Grade(Long id, Student student, Exam exam, Double marksObtained, String remarks) {
        this.id = id;
        this.student = student;
        this.exam = exam;
        this.marksObtained = marksObtained;
        this.remarks = remarks;
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

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
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
