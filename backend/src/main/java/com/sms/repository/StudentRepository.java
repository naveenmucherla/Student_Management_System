package com.sms.repository;

import com.sms.model.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByUserId(Long userId);
    boolean existsByRollNumber(String rollNumber);

    List<Student> findByClassSectionId(Long classSectionId);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.contact) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.guardianName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Student> searchStudents(@Param("query") String query);

    @Query("SELECT s FROM Student s WHERE " +
           "(:query IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:classSectionId IS NULL OR s.classSection.id = :classSectionId)")
    Page<Student> findByFilters(@Param("query") String query, @Param("classSectionId") Long classSectionId, Pageable pageable);

    long countByClassSectionId(Long classSectionId);
}
