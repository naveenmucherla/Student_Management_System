package com.sms.repository;

import com.sms.model.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByClassSectionId(Long classSectionId);
    List<Timetable> findByFacultyId(Long facultyId);
    List<Timetable> findByClassSectionIdAndDayOfWeek(Long classSectionId, DayOfWeek dayOfWeek);
    List<Timetable> findByFacultyIdAndDayOfWeek(Long facultyId, DayOfWeek dayOfWeek);
}
