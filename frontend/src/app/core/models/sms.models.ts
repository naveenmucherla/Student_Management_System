export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  username: string;
  email: string;
  role: Role;
  studentId?: number;
  facultyId?: number;
}

export interface Student {
  id: number;
  name: string;
  rollNumber: string;
  dob?: string;
  contact?: string;
  address?: string;
  guardianName?: string;
  guardianContact?: string;
  enrollmentDate?: string;
  classSectionId: number;
  classSectionName?: string;
  academicYear?: string;
  userId?: number;
  username?: string;
  email?: string;
}

export interface StudentRequest {
  name: string;
  rollNumber: string;
  dob?: string;
  contact?: string;
  address?: string;
  guardianName?: string;
  guardianContact?: string;
  enrollmentDate?: string;
  classSectionId: number;
  userId?: number;
}

export interface Faculty {
  id: number;
  name: string;
  contact?: string;
  department?: string;
  userId?: number;
  username?: string;
  email?: string;
}

export interface FacultyRequest {
  name: string;
  contact?: string;
  department?: string;
  userId?: number;
}

export interface ClassSection {
  id: number;
  name: string;
  academicYear: string;
  roomNumber?: string;
  studentCount?: number;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  description?: string;
  enrolledStudentsCount?: number;
}

export interface Enrollment {
  id: number;
  studentId: number;
  studentName?: string;
  rollNumber?: string;
  courseId: number;
  courseName?: string;
  courseCode?: string;
  credits?: number;
  academicYear: string;
  enrollmentDate?: string;
}

export interface EnrollmentRequest {
  studentId: number;
  courseId: number;
  academicYear: string;
  enrollmentDate?: string;
}

export interface AttendanceRecord {
  id?: number;
  studentId: number;
  studentName?: string;
  rollNumber?: string;
  courseId: number;
  courseName?: string;
  date: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface BulkAttendanceRequest {
  courseId: number;
  date: string;
  entries: {
    studentId: number;
    status: AttendanceStatus;
    remarks?: string;
  }[];
}

export interface StudentAttendanceSummary {
  studentId: number;
  studentName: string;
  rollNumber: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  percentage: number;
}

export interface Exam {
  id: number;
  name: string;
  courseId: number;
  courseName?: string;
  courseCode?: string;
  date: string;
  maxMarks: number;
}

export interface Grade {
  id?: number;
  studentId: number;
  studentName?: string;
  rollNumber?: string;
  examId: number;
  examName?: string;
  courseId?: number;
  courseName?: string;
  courseCode?: string;
  credits?: number;
  marksObtained: number;
  maxMarks?: number;
  percentage?: number;
  letterGrade?: string;
  gradePoint?: number;
  remarks?: string;
}

export interface GradeCreate {
  studentId: number;
  examId: number;
  marksObtained: number;
  remarks?: string;
}

export interface StudentTranscript {
  studentId: number;
  studentName: string;
  rollNumber: string;
  classSectionName?: string;
  academicYear?: string;
  gpa: number;
  totalCredits: number;
  grades: Grade[];
}

export interface GpaResult {
  studentId: number;
  studentName: string;
  rollNumber: string;
  gpa: number;
  totalCredits: number;
  totalCourses: number;
}

export interface TimetableSlot {
  id?: number;
  classSectionId: number;
  classSectionName?: string;
  courseId: number;
  courseName?: string;
  courseCode?: string;
  facultyId: number;
  facultyName?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  room?: string;
}

export interface CourseGradeStat {
  courseCode: string;
  courseName: string;
  averageMarks: number;
  averagePercentage: number;
  gradedStudentsCount: number;
}

export interface DailyAttendanceStat {
  day: string;
  rate: number;
  present: number;
  absent: number;
  late: number;
}

export interface DashboardSummary {
  totalStudents: number;
  totalFaculty: number;
  totalCourses: number;
  totalClasses: number;
  weeklyAttendanceRate: number;
  attendanceStatusDistribution: Record<string, number>;
  courseGradeStats: CourseGradeStat[];
  weeklyAttendanceTrend: DailyAttendanceStat[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  title?: string;
  message: string;
}
