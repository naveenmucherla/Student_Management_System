package com.sms.service;

import com.sms.config.JwtTokenProvider;
import com.sms.dto.auth.AuthResponse;
import com.sms.dto.auth.LoginRequest;
import com.sms.dto.auth.RegisterRequest;
import com.sms.dto.auth.UserDto;
import com.sms.exception.DuplicateResourceException;
import com.sms.exception.ResourceNotFoundException;
import com.sms.model.Faculty;
import com.sms.model.Student;
import com.sms.model.User;
import com.sms.repository.FacultyRepository;
import com.sms.repository.StudentRepository;
import com.sms.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       StudentRepository studentRepository,
                       FacultyRepository facultyRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + loginRequest.getUsername()));

        Long studentId = studentRepository.findByUserId(user.getId()).map(Student::getId).orElse(null);
        Long facultyId = facultyRepository.findByUserId(user.getId()).map(Faculty::getId).orElse(null);

        return new AuthResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getRole(), studentId, facultyId);
    }

    @Transactional
    public UserDto register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new DuplicateResourceException("Username '" + registerRequest.getUsername() + "' is already taken");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email '" + registerRequest.getEmail() + "' is already registered");
        }

        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole());

        User savedUser = userRepository.save(user);
        return new UserDto(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), savedUser.getRole(), savedUser.getCreatedAt());
    }

    public UserDto getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return new UserDto(user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.getCreatedAt());
    }
}
