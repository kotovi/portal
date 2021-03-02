package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="lectionViews")
public class LectionViews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(LectionView.MinimalList.class)
    private Long id;
    @JsonView(LectionView.MinimalList.class)
    private Long studentId;
    @JsonView(LectionView.MinimalList.class)
    private Long lectionId;
    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime addTime;
    @JsonView(LectionView.MinimalList.class)
    private Long watchTime;
    @JsonView(LectionView.MinimalList.class)
    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "studentId", insertable = false, updatable = false )
    private User user;


    public LectionViews(){}

    public LectionViews(Long id, Long studentId, Long lectionId, LocalDateTime addTime, Long watchTime, User user){
        this.id = id;
        this.studentId = studentId;
        this.lectionId = lectionId;
        this.addTime = addTime;
        this.watchTime = watchTime;
        this.user = user;

    }

    public User getUser() {
        return user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getLectionId() {
        return lectionId;
    }

    public void setLectionId(Long lectionId) {
        this.lectionId = lectionId;
    }

    public LocalDateTime getAddTime() {
        return addTime;
    }

    public void setAddTime(LocalDateTime addTime) {
        this.addTime = addTime;
    }

    public Long getWatchTime() {
        return watchTime;
    }

    public void setWatchTime(Long watchTime) {
        this.watchTime = watchTime;
    }
}
