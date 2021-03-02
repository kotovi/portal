package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;


import java.time.LocalDateTime;
import javax.persistence.*;

@Entity
@Table(name="courceForStudents")

public class CourceForStudents {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @JsonView(LectionView.MinimalList.class)
    private Long id;

    @JsonView(LectionView.MinimalList.class)
    private Long creatorId;

    @JsonView(LectionView.MinimalList.class)
    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "creatorId", insertable = false, updatable = false )
    private User user;



    @JsonView(LectionView.MinimalList.class)
    private Long courceId;

    @JsonView(LectionView.MinimalList.class)
    @JsonIgnoreProperties(value={ "lections"})
    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "courceId", insertable = false, updatable = false )
    private  Cource cource;




    @JsonView(LectionView.MinimalList.class)
    private Long userGroupId;

    @JsonView(LectionView.MinimalList.class)
    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "userGroupId", insertable = false, updatable = false )
    private  UserGroup userGroup;



    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createDate;

    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime accessBeginDate;

    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime accessEndDate;

    public CourceForStudents(){

    }




    public CourceForStudents(Long id, Long creatorId, Long courceId,
                             Long userGroupId, LocalDateTime createDate, LocalDateTime accessBeginDate,
                             LocalDateTime accessEndDate, User user, UserGroup userGroup,
                             Cource cource){
        this.id = id;
        this.creatorId = creatorId;
        this.courceId = courceId;
        this.userGroupId = userGroupId;
        this.createDate = createDate;
        this.accessEndDate = accessEndDate;
        this.user = user;
        this.userGroup = userGroup;
        this.cource = cource;
        this.accessBeginDate =  accessBeginDate;

    }


    public LocalDateTime getAccessBeginDate() {
        return accessBeginDate;
    }

    public void setAccessBeginDate(LocalDateTime accessBeginDate) {
        this.accessBeginDate = accessBeginDate;
    }

    public Cource getCource() {
        return cource;
    }

    public void setCource(Cource cource) {
        this.cource = cource;
    }

    public UserGroup getUserGroup() {
        return userGroup;
    }

    public void setUserGroup(UserGroup userGroup) {
        this.userGroup = userGroup;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Long getCourceId() {
        return courceId;
    }

    public void setCourceId(Long courceId) {
        this.courceId = courceId;
    }

    public Long getUserGroupId() {
        return userGroupId;
    }

    public void setUserGroupId(Long userGroupId) {
        this.userGroupId = userGroupId;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public LocalDateTime getAccessEndDate() {
        return accessEndDate;
    }

    public void setAccessEndDate(LocalDateTime accessEndDate) {
        this.accessEndDate = accessEndDate;
    }

}
