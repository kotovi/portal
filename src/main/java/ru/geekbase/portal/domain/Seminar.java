package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="seminar")
public class Seminar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(LectionView.MinimalList.class)
    private Long id;
    @JsonView(LectionView.MinimalList.class)
    private Long creatorId;
    @JsonView(LectionView.MinimalList.class)
    @Column (length = 3000)
    private String seminarName;

    @JsonView(LectionView.MinimalList.class)
    @Column (length = 3000)
    private String enSeminarName;

    @JsonView(LectionView.MinimalList.class)
    @Column (length = 3000)
    private String seminarDescription;

    @JsonView(LectionView.MinimalList.class)
    @Column (length = 3000)
    private String enSeminarDescription;

    @JsonView(LectionView.MinimalList.class)
    @Column (length = 1000)
    private String seminarCreateUrl;
    @JsonView(LectionView.MinimalList.class)
    @Column (length = 1000)
    private String joinUrl;
    @JsonView(LectionView.MinimalList.class)
    private String meetingId;
    @JsonView(LectionView.MinimalList.class)
    private Integer meetingStatus;
    @JsonView(LectionView.MinimalList.class)
    private Integer recordStatus;
    @JsonView(LectionView.MinimalList.class)
    @Column (length = 1000)
    private String meetingRecordUrl;
    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime seminarBeginDate;

    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime seminarCreateDate;

    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "creatorId", insertable = false, updatable = false )
    @JsonView(LectionView.MinimalList.class)
    private User user;

    @OneToMany(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value={ "seminar",
            "user"})
    @JoinColumn(name = "seminarId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonView(LectionView.MinimalList.class)
    private List<SeminarListener> SeminarListeners;

    @OneToMany(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value={ "seminar",
            "user",
            "userGroup"})
    @JoinColumn(name = "seminarId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonView(LectionView.MinimalList.class)
    private List<SeminarForStudents> SeminarGroupListeners;

    public Seminar(){

    }

    public Seminar(Long id,
                   Long creatorId,
                   String seminarName,
                   String seminarDescription,
                   String seminarCreateUrl,
                   String meetingId,
                   Integer meetingStatus,
                   String meetingRecordUrl,
                   String joinUrl,
                   LocalDateTime seminarBeginDate,
                   LocalDateTime seminarCreateDate,
                   Integer recordStatus,
                   User user,
                   String enSeminarName,
                   String enSeminarDescription
    ) {
        this.id = id;
        this.joinUrl = joinUrl;
        this.creatorId = creatorId;
        this.seminarName = seminarName;
        this.seminarDescription = seminarDescription;
        this.seminarCreateUrl = seminarCreateUrl;
        this.meetingId = meetingId;
        this.meetingStatus = meetingStatus;
        this.meetingRecordUrl = meetingRecordUrl;
        this.seminarBeginDate = seminarBeginDate;
        this.seminarCreateDate = seminarCreateDate;
        this.recordStatus = recordStatus;
        this.user = user;
        this.enSeminarName =enSeminarName;
        this.enSeminarDescription = enSeminarDescription;
    }

    public String getEnSeminarName() {
        return enSeminarName;
    }

    public void setEnSeminarName(String enSeminarName) {
        this.enSeminarName = enSeminarName;
    }

    public String getEnSeminarDescription() {
        return enSeminarDescription;
    }

    public void setEnSeminarDescription(String enSeminarDescription) {
        this.enSeminarDescription = enSeminarDescription;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getJoinUrl() {
        return joinUrl;
    }

    public void setJoinUrl(String joinUrl) {
        this.joinUrl = joinUrl;
    }

    public Integer getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(Integer recordStatus) {
        this.recordStatus = recordStatus;
    }

    public LocalDateTime getSeminarCreateDate() {
        return seminarCreateDate;
    }

    public void setSeminarCreateDate(LocalDateTime seminarCreateDate) {
        this.seminarCreateDate = seminarCreateDate;
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

    public String getSeminarName() {
        return seminarName;
    }

    public void setSeminarName(String seminarName) {
        this.seminarName = seminarName;
    }

    public String getSeminarDescription() {
        return seminarDescription;
    }

    public void setSeminarDescription(String seminarDescription) {
        this.seminarDescription = seminarDescription;
    }

    public String getSeminarCreateUrl() {
        return seminarCreateUrl;
    }

    public void setSeminarCreateUrl(String seminarCreateUrl) {
        this.seminarCreateUrl = seminarCreateUrl;
    }

    public String getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(String meetingId) {
        this.meetingId = meetingId;
    }

    public Integer getMeetingStatus() {
        return meetingStatus;
    }

    public void setMeetingStatus(Integer meetingStatus) {
        this.meetingStatus = meetingStatus;
    }

    public String getMeetingRecordUrl() {
        return meetingRecordUrl;
    }

    public void setMeetingRecordUrl(String meetingRecordUrl) {
        this.meetingRecordUrl = meetingRecordUrl;
    }

    public LocalDateTime getSeminarBeginDate() {
        return seminarBeginDate;
    }

    public void setSeminarBeginDate(LocalDateTime seminarBeginDate) {
        this.seminarBeginDate = seminarBeginDate;
    }
}
