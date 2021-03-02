package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="SeminarForStudents")
public class SeminarForStudents {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @JsonView(LectionView.MinimalList.class)
    private Long id;

    @JsonView(LectionView.MinimalList.class)
    private Long creatorId;

    @JsonView(LectionView.MinimalList.class)
    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "creatorId", insertable = false, updatable = false )
    private User user;

    @JsonView(LectionView.MinimalList.class)
    private Long seminarId;

    @JsonView(LectionView.MinimalList.class)
    @JsonIgnoreProperties(value={ "SeminarListeners",
                                    "SeminarGroupListeners"})
    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "seminarId", insertable = false, updatable = false )
    //@OnDelete(action = OnDeleteAction.CASCADE)
    private  Seminar seminar;

    @JsonView(LectionView.MinimalList.class)
    private Long userGroupId;

    @JsonView(LectionView.MinimalList.class)
    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "userGroupId", insertable = false, updatable = false )
    private  UserGroup userGroup;

    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createDate;

    public SeminarForStudents(){}

    public SeminarForStudents(Long creatorId,
                              User user,
                              UserGroup userGroup,
                              Long seminarId,
                              Seminar seminar,
                              Long userGroupId,
                              LocalDateTime createDate) {
        this.creatorId = creatorId;
        this.user = user;
        this.seminarId = seminarId;
        this.seminar = seminar;
        this.userGroupId = userGroupId;
        this.createDate = createDate;
        this.user = user;
        this.userGroup = userGroup;
    }

    public UserGroup getUserGroup() {
        return userGroup;
    }

    public void setUserGroup(UserGroup userGroup) {
        this.userGroup = userGroup;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
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

    public Seminar getSeminar() {
        return seminar;
    }

    public void setSeminar(Seminar seminar) {
        this.seminar = seminar;
    }

    public Long getUserGroupId() {
        return userGroupId;
    }

    public void setUserGroupId(Long userGroupId) {
        this.userGroupId = userGroupId;
    }
}
