package com.sms.dto.attendance;

public class StudentAttendanceSummaryDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private long totalClasses;
    private long presentCount;
    private long absentCount;
    private long lateCount;
    private double percentage;

    public StudentAttendanceSummaryDto() {
    }

    public StudentAttendanceSummaryDto(Long studentId, String studentName, String rollNumber,
                                      long totalClasses, long presentCount, long absentCount, long lateCount,
                                      double percentage) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.totalClasses = totalClasses;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.lateCount = lateCount;
        this.percentage = percentage;
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

    public long getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(long totalClasses) {
        this.totalClasses = totalClasses;
    }

    public long getPresentCount() {
        return presentCount;
    }

    public void setPresentCount(long presentCount) {
        this.presentCount = presentCount;
    }

    public long getAbsentCount() {
        return absentCount;
    }

    public void setAbsentCount(long absentCount) {
        this.absentCount = absentCount;
    }

    public long getLateCount() {
        return lateCount;
    }

    public void setLateCount(long lateCount) {
        this.lateCount = lateCount;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
