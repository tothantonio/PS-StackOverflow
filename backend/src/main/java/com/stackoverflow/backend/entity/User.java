package com.stackoverflow.backend.entity;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String password;

    private double score = 0.0;
    private boolean isBanned = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.USER;

    public User() {}

    public User(Integer id, String username, String email,
                String password, double score, boolean isBanned, LocalDateTime createdAt, UserRole role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.score = score;
        this.isBanned = isBanned;
        this.createdAt = createdAt;
        this.role = role;
    }

}
