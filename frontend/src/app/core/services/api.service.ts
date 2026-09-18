import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Student, StudentRequest, Faculty, FacultyRequest,
  Course, ClassSection, Enrollment, EnrollmentRequest,
  AttendanceRecord, BulkAttendanceRequest, StudentAttendanceSummary,
  Exam, Grade, GradeCreate, StudentTranscript, GpaResult,
  TimetableSlot, DashboardSummary
} from '../models/sms.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ================= Dashboard =================
  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard/summary`);
  }

  // ================= Students =================
  getStudents(query?: string, classSectionId?: number, page: number = 0, size: number = 50): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (query) params = params.set('query', query);
    if (classSectionId) params = params.set('classSectionId', classSectionId.toString());

    return this.http.get<any>(`${this.baseUrl}/students/page`, { params });
  }

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students`);
  }

  searchStudents(query: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students/search`, {
      params: new HttpParams().set('query', query)
    });
  }

  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/students/${id}`);
  }

  getStudentsByClass(classSectionId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students/class/${classSectionId}`);
  }

  createStudent(student: StudentRequest): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/students`, student);
  }

  updateStudent(id: number, student: StudentRequest): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/students/${id}`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/students/${id}`);
  }

  // ================= Faculty =================
  getAllFaculty(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(`${this.baseUrl}/faculty`);
  }

  createFaculty(faculty: FacultyRequest): Observable<Faculty> {
    return this.http.post<Faculty>(`${this.baseUrl}/faculty`, faculty);
  }

  deleteFaculty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/faculty/${id}`);
  }

  // ================= Academics (Courses & Sections) =================
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/courses`, course);
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/courses/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/courses/${id}`);
  }

  getAllClassSections(): Observable<ClassSection[]> {
    return this.http.get<ClassSection[]>(`${this.baseUrl}/class-sections`);
  }

  createClassSection(section: Partial<ClassSection>): Observable<ClassSection> {
    return this.http.post<ClassSection>(`${this.baseUrl}/class-sections`, section);
  }

  updateClassSection(id: number, section: Partial<ClassSection>): Observable<ClassSection> {
    return this.http.put<ClassSection>(`${this.baseUrl}/class-sections/${id}`, section);
  }

  deleteClassSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/class-sections/${id}`);
  }

  // ================= Enrollments =================
  getEnrollmentsByStudent(studentId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.baseUrl}/enrollments/student/${studentId}`);
  }

  enrollStudent(enrollment: EnrollmentRequest): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.baseUrl}/enrollments`, enrollment);
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/enrollments/${id}`);
  }

  // ================= Attendance =================
  markBulkAttendance(request: BulkAttendanceRequest): Observable<AttendanceRecord[]> {
    return this.http.post<AttendanceRecord[]>(`${this.baseUrl}/attendance`, request);
  }

  getStudentAttendance(studentId: number, from?: string, to?: string): Observable<AttendanceRecord[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<AttendanceRecord[]>(`${this.baseUrl}/attendance/student/${studentId}`, { params });
  }

  getClassAttendance(classSectionId: number, date: string): Observable<AttendanceRecord[]> {
    return this.http.get<AttendanceRecord[]>(`${this.baseUrl}/attendance/class/${classSectionId}/date/${date}`);
  }

  getCourseAttendance(courseId: number, date: string): Observable<AttendanceRecord[]> {
    return this.http.get<AttendanceRecord[]>(`${this.baseUrl}/attendance/course/${courseId}/date/${date}`);
  }

  getStudentAttendancePercentage(studentId: number): Observable<StudentAttendanceSummary> {
    return this.http.get<StudentAttendanceSummary>(`${this.baseUrl}/attendance/student/${studentId}/percentage`);
  }

  // ================= Exams & Grades =================
  getAllExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.baseUrl}/exams`);
  }

  createExam(exam: Partial<Exam>): Observable<Exam> {
    return this.http.post<Exam>(`${this.baseUrl}/exams`, exam);
  }

  deleteExam(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/exams/${id}`);
  }

  recordGrade(grade: GradeCreate): Observable<Grade> {
    return this.http.post<Grade>(`${this.baseUrl}/grades`, grade);
  }

  recordBulkGrades(grades: GradeCreate[]): Observable<Grade[]> {
    return this.http.post<Grade[]>(`${this.baseUrl}/grades/bulk`, grades);
  }

  getGradesByExam(examId: number): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${this.baseUrl}/grades/exam/${examId}`);
  }

  getStudentTranscript(studentId: number): Observable<StudentTranscript> {
    return this.http.get<StudentTranscript>(`${this.baseUrl}/grades/student/${studentId}`);
  }

  getStudentGpa(studentId: number): Observable<GpaResult> {
    return this.http.get<GpaResult>(`${this.baseUrl}/grades/student/${studentId}/gpa`);
  }

  // ================= Timetable =================
  getTimetable(classSectionId?: number, facultyId?: number): Observable<TimetableSlot[]> {
    let params = new HttpParams();
    if (classSectionId) params = params.set('classSectionId', classSectionId.toString());
    if (facultyId) params = params.set('facultyId', facultyId.toString());
    return this.http.get<TimetableSlot[]>(`${this.baseUrl}/timetable`, { params });
  }

  createTimetableSlot(slot: TimetableSlot): Observable<TimetableSlot> {
    return this.http.post<TimetableSlot>(`${this.baseUrl}/timetable`, slot);
  }

  updateTimetableSlot(id: number, slot: TimetableSlot): Observable<TimetableSlot> {
    return this.http.put<TimetableSlot>(`${this.baseUrl}/timetable/${id}`, slot);
  }

  deleteTimetableSlot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/timetable/${id}`);
  }
}
