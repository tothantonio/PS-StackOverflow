package com.stackoverflow.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "questions")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String body;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionStatus status = QuestionStatus.RECEIVED;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "question_tags",
            joinColumns = @JoinColumn(name = "question_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Question(){}

    public Question(Integer id, User author, String title, String body, String imageUrl, QuestionStatus status, List<Tag> tags, LocalDateTime createdAt){
        this.id = id;
        this.author = author;
        this.title = title;
        this.body = body;
        this.imageUrl = imageUrl;
        this.status = status;
        this.tags = tags != null ? tags : new ArrayList<>();
        this.createdAt = createdAt;
    }

}
