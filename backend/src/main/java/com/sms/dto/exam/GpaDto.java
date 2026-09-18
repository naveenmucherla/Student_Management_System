package com.sms.dto.exam;

public class GpaDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private Double gpa;
    private Integer totalCredits;
    private Integer totalCourses;

    public GpaDto() {
    }

    public GpaDto(Long studentId, String studentName, String rollNumber, Double gpa, Integer totalCredits, Integer totalCourses) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.gpa = gpa;
        this.totalCredits = totalCredits;
        this.totalCourses = totalCourses;
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

    public Integer getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(Integer totalCourses) {
        this.totalCourses = totalCourses;
    }
}
