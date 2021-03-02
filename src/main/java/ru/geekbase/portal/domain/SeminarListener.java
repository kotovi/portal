package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="SeminarListener")
public class SeminarListener {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @JsonView(LectionView.MinimalList.class)
    private Long id;
    @JsonView(LectionView.MinimalList.class)
    private Long creatorId;
    @JsonView(LectionView.MinimalList.class)
    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "listenerId", insertable = false, updatable = false )
    private User user;
    @JsonView(LectionView.MinimalList.class)
    private Long seminarId;

    @JsonView(LectionView.MinimalList.class)
    private Long listenerId;

    @JsonView(LectionView.MinimalList.class)
    @JsonIgnoreProperties(value={ "SeminarListeners",
            "SeminarGroupListeners"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seminarId", insertable = false, updatable = false )
    private  Seminar seminar;

    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createDate;

    public SeminarListener() {

    }
    public SeminarListener(Long creatorId,
                           User user,
                           Long seminarId,
                           Long listenerId,
                           Seminar seminar,
                           LocalDateTime createDate) {
        this.creatorId = creatorId;
        this.user = user;
        this.seminarId = seminarId;
        this.listenerId = listenerId;
        this.seminar = seminar;
        this.createDate = createDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getSeminarId() {
        return seminarId;
    }

    public void setSeminarId(Long seminarId) {
        this.seminarId = seminarId;
    }

    public Long getListenerId() {
        return listenerId;
    }

    public void setListenerId(Long listenerId) {
        this.listenerId = listenerId;
    }

    public Seminar getSeminar() {
        return seminar;
    }

    public void setSeminar(Seminar seminar) {
        this.seminar = seminar;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }
}
