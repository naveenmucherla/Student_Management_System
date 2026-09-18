# EduTrack PRO — Full-Stack Student Management System (SMS)

A modern, high-performance, full-stack Student Management System built with a **Java 17+ Spring Boot 3.3+** backend and an **Angular 17+** decoupled single-page application frontend.

---

## 🌟 Key Features

- **Stateless JWT Security**: Role-based access control (`ADMIN`, `TEACHER`, `STUDENT`) with Spring Security filters and Angular HTTP interceptors.
- **Rich Dashboard & Analytics**: High-level metrics, real-time weekly attendance trend charts, status distributions, and course grade performance bars.
- **Student Directory & Profiles**: Searchable, filterable, and paginated student roster with a digital transcript drawer and attendance statistics.
- **Academics Management**: Full CRUD for course syllabus catalog and class sections/cohorts.
- **Batch Attendance Sheet**: One-click class roll call marking (`PRESENT`, `ABSENT`, `LATE`) for teachers and automated percentage computation with eligibility badges.
- **Exams, Marks & GPA Engine**: Examination scheduler, teacher marks entry sheet, automatic letter grade assignment, weighted GPA computation on a 4.0 scale, and official printable transcripts.
- **Weekly Timetable Grid**: Interactive multi-column weekly schedule for classes and faculty rooms.
- **Instant Data Seeder**: Built-in `CommandLineRunner` that pre-populates users, classes, courses, faculty, students, grades, and attendance for demoing immediately.

---

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 3.3.4 (Java 17 / Java 21 / Java 25 compatible)
- **Security**: Spring Security 6 with stateless JWT (`io.jsonwebtoken:jjwt:0.12.5`) & BCrypt
- **Persistence**: Spring Data JPA & Hibernate
- **Database**: MySQL 8 (production) with H2 in-memory profile (for zero-config development)
- **Validation**: Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Size`, etc.)
- **Error Handling**: Centralized `@RestControllerAdvice` returning standard `{ status, message, timestamp, path, validationErrors }`

### Frontend
- **Framework**: Angular 17+ Standalone Architecture
- **Routing**: Angular Router with functional `authGuard` & `roleGuard`
- **HTTP**: `HttpClient` with functional `jwtInterceptor` & `errorInterceptor`
- **State & Reactivity**: Angular Signals & RxJS
- **Forms**: Reactive Forms with client-side validators
- **Styling**: Modern CSS Design System (Glassmorphism, CSS Variables, Plus Jakarta Sans, FontAwesome)

---

## 🚀 Quick Start Guide

### Pre-requisites
- **Java**: JDK 17+ (or JDK 21 / 25)
- **Maven**: 3.8+
- **Node.js**: v18+ (tested on Node v20/v22/v26)
- **npm**: v9+
- **MySQL 8** (Optional: H2 in-memory mode is available out of the box)

---

### 1. Database Setup

#### Option A: MySQL 8 (Default)
1. Start your local MySQL server on port `3306`.
2. Ensure database `sms_db` exists or let Spring Boot auto-create it:
   ```sql
   CREATE DATABASE IF NOT EXISTS sms_db;
   ```
3. Check `backend/src/main/resources/application.properties` to verify credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/sms_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=root
   ```

#### Option B: Zero-Config In-Memory Mode (H2)
Run the backend with the `h2` profile without needing a local MySQL server:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
H2 Console is accessible at: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:sms_db`, User: `sa`, Password: empty).

---

### 2. Running Backend from STS (Spring Tool Suite) or Terminal

#### Running via Terminal:
```bash
cd backend
mvn spring-boot:run
```
Backend will start on `http://localhost:8080`.

#### Running via Spring Tool Suite (STS) / IntelliJ IDEA / Eclipse:
1. Open STS and choose **File -> Import... -> Existing Maven Projects**.
2. Browse to the `SMS/backend` folder and click **Finish**.
3. Right-click the project root -> **Run As -> Spring Boot App** (or run `com.sms.StudentManagementSystemApplication`).

---

### 3. Running Frontend (Angular)

```bash
cd frontend
npm install
npm start
```
Frontend application will be served at `http://localhost:4200`.

---

## 🔑 Pre-Seeded Demo Credentials

The login screen features **1-click autofill buttons** for quick testing:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Full CRUD across all modules & users |
| **Teacher** | `teacher1` | `teacher123` | Read students, mark batch attendance, enter exam marks |
| **Student** | `student1` | `student123` | View personal transcript, GPA, attendance history & schedule |

---

## 📡 REST API Summary

### Authentication
- `POST /api/auth/login` — Authenticate and receive JWT Bearer token
- `POST /api/auth/register` — Register a new portal user (Admin only)
- `GET /api/auth/me` — Current authenticated user details

### Students & Directory
- `GET /api/students` — Retrieve all students
- `GET /api/students/page?query=&classSectionId=&page=0&size=10` — Paginated student search
- `GET /api/students/{id}` — Get single student profile
- `POST /api/students` — Enroll new student (Admin)
- `PUT /api/students/{id}` — Update student profile (Admin)
- `DELETE /api/students/{id}` — Delete student record (Admin)

### Academics (Courses & Class Sections)
- `GET/POST/PUT/DELETE /api/courses` — Course catalog management
- `GET/POST/PUT/DELETE /api/class-sections` — Cohort & section management
- `GET/POST/DELETE /api/enrollments` — Student course enrollments

### Attendance
- `POST /api/attendance` — Save batch attendance for a class & date
- `GET /api/attendance/class/{classSectionId}/date/{date}` — Fetch attendance roster for a date
- `GET /api/attendance/student/{studentId}` — Student attendance session history
- `GET /api/attendance/student/{studentId}/percentage` — Computed attendance % and eligibility

### Exams & Grades
- `GET/POST/DELETE /api/exams` — Manage test assessments
- `POST /api/grades/bulk` — Submit marks roster for an exam
- `GET /api/grades/student/{studentId}` — Aggregated transcript across all courses
- `GET /api/grades/student/{studentId}/gpa` — Cumulative GPA calculation

### Timetable & Dashboard
- `GET/POST/PUT/DELETE /api/timetable` — Weekly lecture scheduler
- `GET /api/dashboard/summary` — Analytics metrics, attendance trends, and course grade distributions
