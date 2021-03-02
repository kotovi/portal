package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="user_group")
public class UserGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(LectionView.MinimalList.class)
    private Long id;
    @JsonView(LectionView.MinimalList.class)
    private String groupName;
    @JsonView(LectionView.ForLectionList.class)
    private String groupAnnotation;
    @JsonView(LectionView.FullMessage.class)
    private Long creatorId;
    @JsonView(LectionView.MinimalList.class)
    private Integer groupType;
    @JsonView(UserView.FullUserList.class)
    private LocalDateTime creationDateTime;
    @JsonView(UserView.FullUserList.class)
    private Boolean userGroupIsActive;
    @JsonView(UserView.FullUserList.class)
    private LocalDateTime userGroupDeactivationTime;
    @JsonView(LectionView.MinimalList.class)
    private Long nidInIsmu;

    @OneToMany(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value={ "notificationAgree",
            "userAgreement",
            "personalDataAgree",
            "phoneNumber",
            "userGroup",
            "userRole",
            "active",
            "username",
            "roles",
    "userEmail"})
    @JoinColumn(name = "userGroup")
    @Where(clause = "active = 1")
    @JsonView(LectionView.MinimalList.class)
    private List<User> users;


    public UserGroup(){}





    public UserGroup(Long id,
                     String groupName,
                     String groupAnnotation,
                     Long creatorId,
                     LocalDateTime creationDateTime,
                     Integer groupType,
                     Boolean userGroupIsActive,
                     LocalDateTime userGroupDeactivationTime,
                     Long nidInIsmu
    ){
        this.id = id;
        this.groupName = groupName;
        this.groupAnnotation = groupAnnotation;
        this.creatorId = creatorId;
        this.creationDateTime = creationDateTime;
        this.groupType = groupType;
        this.userGroupDeactivationTime = userGroupDeactivationTime;
        this.userGroupIsActive = userGroupIsActive;
        this.nidInIsmu = nidInIsmu;
    }

    public Long getNidInIsmu() {
        return nidInIsmu;
    }

    public void setNidInIsmu(Long nidInIsmu) {
        this.nidInIsmu = nidInIsmu;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getGroupAnnotation() {
        return groupAnnotation;
    }

    public void setGroupAnnotation(String groupAnnotation) {
        this.groupAnnotation = groupAnnotation;
    }
    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public LocalDateTime getCreationDateTime() {
        return creationDateTime;
    }

    public void setCreationDateTime(LocalDateTime creationDateTime) {
        this.creationDateTime = creationDateTime;
    }
    public Boolean getUserGroupIsActive() {
        return userGroupIsActive;
    }

    public void setUserGroupIsActive(Boolean userGroupIsActive) {
        this.userGroupIsActive = userGroupIsActive;
    }

    public LocalDateTime getUserGroupDeactivationTime() {
        return userGroupDeactivationTime;
    }

    public void setUserGroupDeactivationTime(LocalDateTime userGroupDeactivationTime) {
        this.userGroupDeactivationTime = userGroupDeactivationTime;
    }
    public Integer getGroupType() {
        return groupType;
    }

    public void setGroupType(Integer groupType) {
        this.groupType = groupType;
    }
}
