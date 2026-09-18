package com.sms.config;

import com.sms.enums.AttendanceStatus;
import com.sms.enums.Role;
import com.sms.model.*;
import com.sms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final ClassSectionRepository classSectionRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final ExamRepository examRepository;
    private final GradeRepository gradeRepository;
    private final TimetableRepository timetableRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      StudentRepository studentRepository,
                      FacultyRepository facultyRepository,
                      ClassSectionRepository classSectionRepository,
                      CourseRepository courseRepository,
                      EnrollmentRepository enrollmentRepository,
                      AttendanceRepository attendanceRepository,
                      ExamRepository examRepository,
                      GradeRepository gradeRepository,
                      TimetableRepository timetableRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.classSectionRepository = classSectionRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.attendanceRepository = attendanceRepository;
        this.examRepository = examRepository;
        this.gradeRepository = gradeRepository;
        this.timetableRepository = timetableRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded. Skipping initial seeding.");
            return;
        }

        logger.info("Seeding initial data for Student Management System...");

        // 1. Seed Users
        User adminUser = new User(null, "admin", passwordEncoder.encode("admin123"), "admin@sms.edu", Role.ADMIN);
        User teacherUser1 = new User(null, "teacher1", passwordEncoder.encode("teacher123"), "turing@sms.edu", Role.TEACHER);
        User teacherUser2 = new User(null, "teacher2", passwordEncoder.encode("teacher123"), "ada@sms.edu", Role.TEACHER);

        User studentUser1 = new User(null, "student1", passwordEncoder.encode("student123"), "alice@sms.edu", Role.STUDENT);
        User studentUser2 = new User(null, "student2", passwordEncoder.encode("student123"), "bob@sms.edu", Role.STUDENT);
        User studentUser3 = new User(null, "student3", passwordEncoder.encode("student123"), "charlie@sms.edu", Role.STUDENT);
        User studentUser4 = new User(null, "student4", passwordEncoder.encode("student123"), "diana@sms.edu", Role.STUDENT);
        User studentUser5 = new User(null, "student5", passwordEncoder.encode("student123"), "ethan@sms.edu", Role.STUDENT);

        userRepository.saveAll(List.of(adminUser, teacherUser1, teacherUser2, studentUser1, studentUser2, studentUser3, studentUser4, studentUser5));

        // 2. Seed Class Sections
        ClassSection sec1 = new ClassSection(null, "Grade 10-A", "2025-2026", "Room 101");
        ClassSection sec2 = new ClassSection(null, "Grade 10-B", "2025-2026", "Room 102");
        ClassSection sec3 = new ClassSection(null, "CSE-3A", "2025-2026", "Lab 305");
        classSectionRepository.saveAll(List.of(sec1, sec2, sec3));

        // 3. Seed Courses
        Course c1 = new Course(null, "Intro to Computer Science", "CS101", 4, "Fundamental programming concepts in Java & Python");
        Course c2 = new Course(null, "Data Structures & Algorithms", "CS201", 4, "Trees, graphs, dynamic programming and complexity analysis");
        Course c3 = new Course(null, "Calculus & Linear Algebra", "MATH101", 3, "Differential equations, matrices, and vector spaces");
        Course c4 = new Course(null, "Technical Communication", "ENG102", 2, "Professional technical writing and presentation skills");
        Course c5 = new Course(null, "Applied Physics", "PHY101", 3, "Mechanics, thermodynamics, and optics laboratory");
        courseRepository.saveAll(List.of(c1, c2, c3, c4, c5));

        // 4. Seed Faculty
        Faculty fac1 = new Faculty(null, "Dr. Alan Turing", "+1 (555) 234-5678", "Computer Science", teacherUser1);
        Faculty fac2 = new Faculty(null, "Prof. Ada Lovelace", "+1 (555) 345-6789", "Mathematics & Computing", teacherUser2);
        facultyRepository.saveAll(List.of(fac1, fac2));

        // 5. Seed Students
        Student s1 = new Student(null, "Alice Johnson", "STU-2026-001", LocalDate.of(2005, 4, 15),
                "+1 (555) 019-2831", "124 Science Park Way, Suite 4", "Robert Johnson", "+1 (555) 019-2830",
                LocalDate.of(2023, 9, 1), sec1, studentUser1);

        Student s2 = new Student(null, "Bob Smith", "STU-2026-002", LocalDate.of(2005, 8, 22),
                "+1 (555) 019-4721", "88 Maple Street, Apt 2B", "Sarah Smith", "+1 (555) 019-4720",
                LocalDate.of(2023, 9, 1), sec1, studentUser2);

        Student s3 = new Student(null, "Charlie Brown", "STU-2026-003", LocalDate.of(2004, 11, 5),
                "+1 (555) 019-8832", "42 Beacon Boulevard", "David Brown", "+1 (555) 019-8830",
                LocalDate.of(2023, 9, 1), sec2, studentUser3);

        Student s4 = new Student(null, "Diana Prince", "STU-2026-004", LocalDate.of(2005, 1, 30),
                "+1 (555) 019-9941", "700 Olympus Way", "Hippolyta Prince", "+1 (555) 019-9940",
                LocalDate.of(2023, 9, 1), sec3, studentUser4);

        Student s5 = new Student(null, "Ethan Hunt", "STU-2026-005", LocalDate.of(2004, 6, 18),
                "+1 (555) 019-3312", "15 IMF Quarter, Downtown", "Nathan Hunt", "+1 (555) 019-3310",
                LocalDate.of(2023, 9, 1), sec3, studentUser5);

        studentRepository.saveAll(List.of(s1, s2, s3, s4, s5));

        // 6. Seed Enrollments
        List<Enrollment> enrollments = new ArrayList<>();
        enrollments.add(new Enrollment(null, s1, c1, "2025-2026", LocalDate.of(2025, 9, 1)));
        enrollments.add(new Enrollment(null, s1, c2, "2025-2026", LocalDate.of(2025, 9, 1)));
        enrollments.add(new Enrollment(null, s1, c3, "2025-2026", LocalDate.of(2025, 9, 1)));
        enrollments.add(new Enrollment(null, s1, c4, "2025-2026", LocalDate.of(2025, 9, 1)));

        enrollments.add(new Enrollment(null, s2, c1, "2025-2026", LocalDate.of(2025, 9, 1)));
        enrollments.add(new Enrollment(null, s2, c2, "2025-2026", LocalDate.of(2025, 9, 1)));
        enrollments.add(new Enrollment(null, s2, c3, "2025-2026", LocalDate.of(2025, 9, 1)));

        enrollments.add(new Enrollment(null, s3, c1, "2025-2026", LocalDate.of(2025, 9, 1)));
        enrollments.add(new Enrollment(null, s3, c3, "2025-2026", LocalDate.of(2025, 9, 1)));

        enrollments.add(new Enrollment(null, s4, c1, "2025-2026", LocalDate.of(2025, 9, 1)));
        enrollments.add(new Enrollment(null, s4, c2, "2025-2026", LocalDate.of(2025, 9, 1)));
        enrollments.add(new Enrollment(null, s4, c5, "2025-2026", LocalDate.of(2025, 9, 1)));

        enrollments.add(new Enrollment(null, s5, c2, "2025-2026", LocalDate.of(2025, 9, 1)));
        enrollments.add(new Enrollment(null, s5, c5, "2025-2026", LocalDate.of(2025, 9, 1)));
        enrollmentRepository.saveAll(enrollments);

        // 7. Seed Attendance records (past 5 working days)
        LocalDate today = LocalDate.now();
        List<Attendance> attendances = new ArrayList<>();
        for (int i = 5; i >= 1; i--) {
            LocalDate date = today.minusDays(i);
            attendances.add(new Attendance(null, s1, c1, date, AttendanceStatus.PRESENT, "Attended regularly"));
            attendances.add(new Attendance(null, s2, c1, date, (i == 2 ? AttendanceStatus.LATE : AttendanceStatus.PRESENT), ""));
            attendances.add(new Attendance(null, s3, c1, date, (i == 4 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT), i == 4 ? "Medical reason" : ""));
            attendances.add(new Attendance(null, s4, c1, date, AttendanceStatus.PRESENT, ""));
            attendances.add(new Attendance(null, s5, c2, date, AttendanceStatus.PRESENT, ""));
        }
        attendanceRepository.saveAll(attendances);

        // 8. Seed Exams
        Exam ex1 = new Exam(null, "Midterm Exam", c1, LocalDate.of(2025, 10, 15), 100.0);
        Exam ex2 = new Exam(null, "Final Term Exam", c1, LocalDate.of(2025, 12, 10), 100.0);
        Exam ex3 = new Exam(null, "Midterm Practical", c2, LocalDate.of(2025, 10, 20), 50.0);
        Exam ex4 = new Exam(null, "Calculus Quiz 1", c3, LocalDate.of(2025, 9, 28), 25.0);
        Exam ex5 = new Exam(null, "Applied Physics Lab Test", c5, LocalDate.of(2025, 11, 14), 50.0);
        examRepository.saveAll(List.of(ex1, ex2, ex3, ex4, ex5));

        // 9. Seed Grades
        List<Grade> grades = new ArrayList<>();
        grades.add(new Grade(null, s1, ex1, 94.0, "Outstanding conceptual grasp"));
        grades.add(new Grade(null, s1, ex2, 92.5, "Excellent code quality"));
        grades.add(new Grade(null, s1, ex3, 48.0, "Great algorithm implementation"));
        grades.add(new Grade(null, s1, ex4, 24.0, "Top score in quiz"));

        grades.add(new Grade(null, s2, ex1, 84.0, "Good performance"));
        grades.add(new Grade(null, s2, ex2, 79.5, "Satisfactory analysis"));
        grades.add(new Grade(null, s2, ex3, 41.0, "Passable lab results"));

        grades.add(new Grade(null, s3, ex1, 72.0, "Work on edge-case testing"));
        grades.add(new Grade(null, s3, ex4, 19.5, "Good grasp of derivatives"));

        grades.add(new Grade(null, s4, ex1, 98.0, "Exceptional problem solving"));
        grades.add(new Grade(null, s4, ex3, 50.0, "Flawless score"));
        grades.add(new Grade(null, s4, ex5, 47.0, "Superb experimental accuracy"));

        grades.add(new Grade(null, s5, ex3, 44.0, "Solid implementation"));
        grades.add(new Grade(null, s5, ex5, 42.0, "Good lab work"));
        gradeRepository.saveAll(grades);

        // 10. Seed Timetable Slots
        List<Timetable> timetableSlots = new ArrayList<>();
        timetableSlots.add(new Timetable(null, sec1, c1, fac1, DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(10, 30), "Room 101"));
        timetableSlots.add(new Timetable(null, sec1, c3, fac2, DayOfWeek.MONDAY, LocalTime.of(11, 0), LocalTime.of(12, 30), "Room 101"));
        timetableSlots.add(new Timetable(null, sec1, c2, fac1, DayOfWeek.TUESDAY, LocalTime.of(9, 0), LocalTime.of(10, 30), "Lab 305"));
        timetableSlots.add(new Timetable(null, sec1, c4, fac2, DayOfWeek.WEDNESDAY, LocalTime.of(10, 0), LocalTime.of(11, 30), "Auditorium A"));
        timetableSlots.add(new Timetable(null, sec1, c1, fac1, DayOfWeek.THURSDAY, LocalTime.of(9, 0), LocalTime.of(10, 30), "Room 101"));
        timetableSlots.add(new Timetable(null, sec1, c2, fac1, DayOfWeek.FRIDAY, LocalTime.of(14, 0), LocalTime.of(15, 30), "Lab 305"));

        timetableSlots.add(new Timetable(null, sec2, c1, fac1, DayOfWeek.TUESDAY, LocalTime.of(11, 0), LocalTime.of(12, 30), "Room 102"));
        timetableSlots.add(new Timetable(null, sec2, c3, fac2, DayOfWeek.WEDNESDAY, LocalTime.of(9, 0), LocalTime.of(10, 30), "Room 102"));
        timetableSlots.add(new Timetable(null, sec3, c5, fac2, DayOfWeek.MONDAY, LocalTime.of(14, 0), LocalTime.of(16, 0), "Physics Lab"));
        timetableSlots.add(new Timetable(null, sec3, c2, fac1, DayOfWeek.THURSDAY, LocalTime.of(11, 0), LocalTime.of(12, 30), "Lab 305"));

        timetableRepository.saveAll(timetableSlots);

        logger.info("Data seeding completed successfully! Seeded 8 users, 3 classes, 5 courses, 2 faculty, 5 students, 12 enrollments, 25 attendance logs, 5 exams, 14 grades, and 10 timetable slots.");
    }
}
