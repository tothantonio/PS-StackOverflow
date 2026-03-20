package com.stackoverflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "answers")
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    private String imageUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Answer(){}

    public Answer(Integer id, Question question, User author, String body, String imageUrl, LocalDateTime createdAt) {
        this.id = id;
        this.question = question;
        this.author = author;
        this.body = body;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
    }

}