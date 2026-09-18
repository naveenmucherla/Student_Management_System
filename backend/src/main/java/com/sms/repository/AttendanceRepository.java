package com.sms.repository;

import com.sms.enums.AttendanceStatus;
import com.sms.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByStudentIdAndCourseIdAndDate(Long studentId, Long courseId, LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.student.id = :studentId " +
           "AND (:from IS NULL OR a.date >= :from) " +
           "AND (:to IS NULL OR a.date <= :to) " +
           "ORDER BY a.date DESC")
    List<Attendance> findByStudentIdAndDateRange(@Param("studentId") Long studentId,
                                                @Param("from") LocalDate from,
                                                @Param("to") LocalDate to);

    @Query("SELECT a FROM Attendance a WHERE a.student.classSection.id = :classSectionId AND a.date = :date")
    List<Attendance> findByClassSectionIdAndDate(@Param("classSectionId") Long classSectionId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Attendance a WHERE a.course.id = :courseId AND a.date = :date")
    List<Attendance> findByCourseIdAndDate(@Param("courseId") Long courseId, @Param("date") LocalDate date);

    long countByStudentId(Long studentId);
    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    long countByDateBetween(LocalDate start, LocalDate end);
    long countByDateBetweenAndStatus(LocalDate start, LocalDate end, AttendanceStatus status);

    @Query("SELECT a.status, COUNT(a) FROM Attendance a GROUP BY a.status")
    List<Object[]> countGroupByStatus();
}
