package com.sms.repository;

import com.sms.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    List<Enrollment> findByCourseId(Long courseId);
    List<Enrollment> findByAcademicYear(String academicYear);
    Optional<Enrollment> findByStudentIdAndCourseIdAndAcademicYear(Long studentId, Long courseId, String academicYear);
    boolean existsByStudentIdAndCourseIdAndAcademicYear(Long studentId, Long courseId, String academicYear);
    long countByCourseId(Long courseId);
}
