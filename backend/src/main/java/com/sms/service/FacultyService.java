package com.sms.service;

import com.sms.dto.faculty.FacultyRequestDto;
import com.sms.dto.faculty.FacultyResponseDto;
import com.sms.exception.ResourceNotFoundException;
import com.sms.model.Faculty;
import com.sms.model.User;
import com.sms.repository.FacultyRepository;
import com.sms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;
    private final UserRepository userRepository;

    public FacultyService(FacultyRepository facultyRepository, UserRepository userRepository) {
        this.facultyRepository = facultyRepository;
        this.userRepository = userRepository;
    }

    public List<FacultyResponseDto> getAllFaculty() {
        return facultyRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public FacultyResponseDto getFacultyById(Long id) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + id));
        return mapToDto(faculty);
    }

    @Transactional
    public FacultyResponseDto createFaculty(FacultyRequestDto dto) {
        User user = null;
        if (dto.getUserId() != null) {
            user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));
        }

        Faculty faculty = new Faculty();
        faculty.setName(dto.getName());
        faculty.setContact(dto.getContact());
        faculty.setDepartment(dto.getDepartment());
        faculty.setUser(user);

        Faculty saved = facultyRepository.save(faculty);
        return mapToDto(saved);
    }

    @Transactional
    public FacultyResponseDto updateFaculty(Long id, FacultyRequestDto dto) {
        Faculty faculty = facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + id));

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + dto.getUserId()));
            faculty.setUser(user);
        }

        faculty.setName(dto.getName());
        faculty.setContact(dto.getContact());
        faculty.setDepartment(dto.getDepartment());

        Faculty updated = facultyRepository.save(faculty);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteFaculty(Long id) {
        if (!facultyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Faculty not found with ID: " + id);
        }
        facultyRepository.deleteById(id);
    }

    public FacultyResponseDto mapToDto(Faculty faculty) {
        FacultyResponseDto dto = new FacultyResponseDto();
        dto.setId(faculty.getId());
        dto.setName(faculty.getName());
        dto.setContact(faculty.getContact());
        dto.setDepartment(faculty.getDepartment());

        if (faculty.getUser() != null) {
            dto.setUserId(faculty.getUser().getId());
            dto.setUsername(faculty.getUser().getUsername());
            dto.setEmail(faculty.getUser().getEmail());
        }

        return dto;
    }
}
