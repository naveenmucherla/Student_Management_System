package com.sms.repository;

import com.sms.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    List<Grade> findByStudentId(Long studentId);
    List<Grade> findByExamId(Long examId);
    Optional<Grade> findByStudentIdAndExamId(Long studentId, Long examId);

    @Query("SELECT g FROM Grade g WHERE g.exam.course.id = :courseId")
    List<Grade> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT g.exam.course.code, g.exam.course.name, AVG(g.marksObtained), AVG((g.marksObtained / g.exam.maxMarks) * 100), COUNT(g) " +
           "FROM Grade g GROUP BY g.exam.course.id, g.exam.course.code, g.exam.course.name")
    List<Object[]> findAverageGradesByCourse();
}
