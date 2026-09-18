package com.sms.dto.dashboard;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDto {
    private long totalStudents;
    private long totalFaculty;
    private long totalCourses;
    private long totalClasses;
    private double weeklyAttendanceRate;
    private Map<String, Long> attendanceStatusDistribution;
    private List<CourseGradeStat> courseGradeStats;
    private List<DailyAttendanceStat> weeklyAttendanceTrend;

    public static class CourseGradeStat {
        private String courseCode;
        private String courseName;
        private double averageMarks;
        private double averagePercentage;
        private long gradedStudentsCount;

        public CourseGradeStat() {
        }

        public CourseGradeStat(String courseCode, String courseName, double averageMarks, double averagePercentage, long gradedStudentsCount) {
            this.courseCode = courseCode;
            this.courseName = courseName;
            this.averageMarks = averageMarks;
            this.averagePercentage = averagePercentage;
            this.gradedStudentsCount = gradedStudentsCount;
        }

        public String getCourseCode() {
            return courseCode;
        }

        public void setCourseCode(String courseCode) {
            this.courseCode = courseCode;
        }

        public String getCourseName() {
            return courseName;
        }

        public void setCourseName(String courseName) {
            this.courseName = courseName;
        }

        public double getAverageMarks() {
            return averageMarks;
        }

        public void setAverageMarks(double averageMarks) {
            this.averageMarks = averageMarks;
        }

        public double getAveragePercentage() {
            return averagePercentage;
        }

        public void setAveragePercentage(double averagePercentage) {
            this.averagePercentage = averagePercentage;
        }

        public long getGradedStudentsCount() {
            return gradedStudentsCount;
        }

        public void setGradedStudentsCount(long gradedStudentsCount) {
            this.gradedStudentsCount = gradedStudentsCount;
        }
    }

    public static class DailyAttendanceStat {
        private String day;
        private double rate;
        private long present;
        private long absent;
        private long late;

        public DailyAttendanceStat() {
        }

        public DailyAttendanceStat(String day, double rate, long present, long absent, long late) {
            this.day = day;
            this.rate = rate;
            this.present = present;
            this.absent = absent;
            this.late = late;
        }

        public String getDay() {
            return day;
        }

        public void setDay(String day) {
            this.day = day;
        }

        public double getRate() {
            return rate;
        }

        public void setRate(double rate) {
            this.rate = rate;
        }

        public long getPresent() {
            return present;
        }

        public void setPresent(long present) {
            this.present = present;
        }

        public long getAbsent() {
            return absent;
        }

        public void setAbsent(long absent) {
            this.absent = absent;
        }

        public long getLate() {
            return late;
        }

        public void setLate(long late) {
            this.late = late;
        }
    }

    public DashboardSummaryDto() {
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalFaculty() {
        return totalFaculty;
    }

    public void setTotalFaculty(long totalFaculty) {
        this.totalFaculty = totalFaculty;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(long totalClasses) {
        this.totalClasses = totalClasses;
    }

    public double getWeeklyAttendanceRate() {
        return weeklyAttendanceRate;
    }

    public void setWeeklyAttendanceRate(double weeklyAttendanceRate) {
        this.weeklyAttendanceRate = weeklyAttendanceRate;
    }

    public Map<String, Long> getAttendanceStatusDistribution() {
        return attendanceStatusDistribution;
    }

    public void setAttendanceStatusDistribution(Map<String, Long> attendanceStatusDistribution) {
        this.attendanceStatusDistribution = attendanceStatusDistribution;
    }

    public List<CourseGradeStat> getCourseGradeStats() {
        return courseGradeStats;
    }

    public void setCourseGradeStats(List<CourseGradeStat> courseGradeStats) {
        this.courseGradeStats = courseGradeStats;
    }

    public List<DailyAttendanceStat> getWeeklyAttendanceTrend() {
        return weeklyAttendanceTrend;
    }

    public void setWeeklyAttendanceTrend(List<DailyAttendanceStat> weeklyAttendanceTrend) {
        this.weeklyAttendanceTrend = weeklyAttendanceTrend;
    }
}
