package com.sms.dto.exam;

import java.util.List;

public class StudentTranscriptDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String classSectionName;
    private String academicYear;
    private Double gpa;
    private Integer totalCredits;
    private List<GradeDto> grades;

    public StudentTranscriptDto() {
    }

    public StudentTranscriptDto(Long studentId, String studentName, String rollNumber,
                                String classSectionName, String academicYear,
                                Double gpa, Integer totalCredits, List<GradeDto> grades) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.classSectionName = classSectionName;
        this.academicYear = academicYear;
        this.gpa = gpa;
        this.totalCredits = totalCredits;
        this.grades = grades;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getClassSectionName() {
        return classSectionName;
    }

    public void setClassSectionName(String classSectionName) {
        this.classSectionName = classSectionName;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public Double getGpa() {
        return gpa;
    }

    public void setGpa(Double gpa) {
        this.gpa = gpa;
    }

    public Integer getTotalCredits() {
        return totalCredits;
    }

    public void setTotalCredits(Integer totalCredits) {
        this.totalCredits = totalCredits;
    }

    public List<GradeDto> getGrades() {
        return grades;
    }

    public void setGrades(List<GradeDto> grades) {
        this.grades = grades;
    }
}
