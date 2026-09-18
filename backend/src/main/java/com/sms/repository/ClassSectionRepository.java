package com.sms.repository;

import com.sms.model.ClassSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassSectionRepository extends JpaRepository<ClassSection, Long> {
    List<ClassSection> findByAcademicYear(String academicYear);
    boolean existsByNameAndAcademicYear(String name, String academicYear);
}
