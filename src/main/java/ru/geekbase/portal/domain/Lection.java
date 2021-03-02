package ru.geekbase.portal.domain;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;


import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;


@JsonIgnoreProperties(ignoreUnknown = true)

@Entity
@Table(name="lection")
public class Lection{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(LectionView.MinimalList.class)
    private Long id;

    @JsonView({LectionView.MinimalList.class, QuestionView.ForLector.class})
    private Long testId;

    @JsonView({LectionView.MinimalList.class, QuestionView.ForLector.class})
    @Column (length = 3000)
    private String lectionName;

    @JsonView({LectionView.MinimalList.class, QuestionView.ForLector.class})
    @Column (length = 3000)
    private String enLectionName;

    @JsonView(LectionView.MinimalList.class)
    @Column (length = 3000)
    private String lectionDescription;

    @JsonView(LectionView.MinimalList.class)
    @Column (length = 3000)
    private String enLectionDescription;

    @JsonView({LectionView.ForFront.class, LectionView.MinimalList.class})
    @Column (length = 3000)
    private String lectionUrl;

    @JsonView(LectionView.FullMessage.class)
    @Column (length = 3000)
    private String lectionCreateUrl;

    @JsonView(LectionView.ForFront.class)
    private Integer lectionPosition;

    @JsonView(LectionView.MinimalList.class)
    private Long courceId;

    @JsonView(LectionView.FullMessage.class)
    private String meetingID;

    @JsonView(LectionView.FullMessage.class)
    private String internalMeetingID;

    @JsonView(LectionView.ForFront.class)
    private Integer meetingStatus;

    @JsonView(LectionView.MinimalList.class)
    private Integer recordStatus;

    @JsonView(LectionView.ForFront.class)
    private String lectionUrlForRecord;

    @JsonView(LectionView.ForFront.class)
    @Column (length = 1000)
    private String joinUrl;

    @JsonView(LectionView.ForFront.class)
    private Integer lectionRewrite;

    @ManyToOne(fetch = FetchType.EAGER )
    @JsonIgnoreProperties(value={ "lections"})
    @JoinColumn(name = "courceId", insertable = false, updatable = false )
    @JsonView(LectionView.MinimalList.class)
    private Cource cource;

    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "authorId", insertable = false, updatable = false )
    @JsonView(LectionView.MinimalList.class)
    private User user;

    @JsonView(LectionView.MinimalList.class)
    private Long authorId;


    @JsonView(LectionView.FullMessage.class)
    private String mailForReport;


    @JsonView(LectionView.ForFront.class)
    private  boolean deleted;

    @JsonView(LectionView.ForLectionList.class)
    private Long whoDeleted;

    @JsonView(LectionView.ForFront.class)
    private LocalDateTime deleteDate;

    @JsonView(LectionView.ForFront.class)
    private Long userGroup;

    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "userGroup", insertable = false, updatable = false )
    @JsonView(LectionView.ForFront.class)
    private UserGroup uGroup;



    @JsonView(LectionView.ForFront.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lectionCreateDateTime;

    @JsonView(LectionView.ForFront.class)
    private Boolean isModerated;

    @JsonView(LectionView.ForFront.class)
    private Long moderatorId;

    @JsonView(LectionView.ForFront.class)
    private String moderatorComment;

  //  @OneToMany(fetch = FetchType.LAZY)
  //  @JsonIgnoreProperties(value={ "lection","cource", "test","user"})
  //  @JoinColumn(name = "lectionId", insertable = false, updatable = false)
   // @JsonView({QuestionView.ForLector.class, LectionView.ForFront.class})
  // private List<Test> tests;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "testId", insertable = false, updatable = false)
    @JsonView(LectionView.ForFront.class)
    @JsonIgnoreProperties(value={ "lections", "test"})
    private Test test;


    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "lectionId", insertable = false, updatable = false)
    @JsonView({LectionView.ForFront.class, QuestionView.ForLector.class})
    private List<File> files;

    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime accessBeginDate;



    public Lection(Long id,
                   Long testId,
                   Long courceId,
                   String lectionName,
                   String lectionDescription,
                   Integer lectionPosition,
                   String lectionUrl,
                   Cource cource,
                   String meetingID,
                   String internalMeetingID,
                   String joinUrl,
                   String lectionUrlForRecord,
                   Integer meetingStatus,
                   Integer recordStatus,
                   String lectionCreateUrl,
                   Integer lectionRewrite,
                   Long authorId,
                   String mailForReport,
                   LocalDateTime lectionCreateDateTime,
                   Long userGroup,
                   Boolean deleted,
                   Long whoDeleted,
                   LocalDateTime deleteDate,
                   User user,
                   UserGroup uGroup,
                   Boolean isModerated,
                   Long moderatorId,
                   String moderatorComment,
                   Test test,
                   LocalDateTime accessBeginDate ,
                   List<File> files,
                   String enLectionName,
                   String enLectionDescription){
        this.id = id;
        this.testId = testId;
        this.lectionName = lectionName;
        this.lectionDescription = lectionDescription;
        this.lectionPosition = lectionPosition;
        this.lectionUrl = lectionUrl;
        this.cource = cource;
        this.courceId = courceId;
        this.meetingID = meetingID;
        this.internalMeetingID = internalMeetingID;
        this.joinUrl = joinUrl;
        this.lectionUrlForRecord = lectionUrlForRecord;
        this.meetingStatus = meetingStatus;
        this.recordStatus = recordStatus;
        this.lectionCreateUrl = lectionCreateUrl;
        this.lectionRewrite = lectionRewrite;
        this.authorId = authorId;
        this.mailForReport=mailForReport;
        this.lectionCreateDateTime = lectionCreateDateTime;
        this.userGroup=userGroup;
        this.deleted = deleted;
        this.whoDeleted = whoDeleted;
        this.deleteDate = deleteDate;
        this.user=user;
        this.uGroup=uGroup;
        this.isModerated = isModerated;
        this.moderatorId = moderatorId;
        this.moderatorComment = moderatorComment;
        this.test= test;
        this.accessBeginDate = accessBeginDate;
        this.files = files;
        this.enLectionName = enLectionName;
        this.enLectionDescription = enLectionDescription;
    }

    public String getEnLectionName() {
        return enLectionName;
    }

    public void setEnLectionName(String enLectionName) {
        this.enLectionName = enLectionName;
    }

    public String getEnLectionDescription() {
        return enLectionDescription;
    }

    public void setEnLectionDescription(String enLectionDescription) {
        this.enLectionDescription = enLectionDescription;
    }


    public List<File> getFiles() {
        return files;
    }

    public void setFiles(List<File> files) {
        this.files = files;
    }

    public LocalDateTime getAccessBeginDate() {
        return accessBeginDate;
    }

    public void setAccessBeginDate(LocalDateTime accessBeginDate) {
        this.accessBeginDate = accessBeginDate;
    }

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }

    public Boolean getModerated() {
        return isModerated;
    }

    public void setModerated(Boolean moderated) {
        isModerated = moderated;
    }

    public Long getModeratorId() {
        return moderatorId;
    }

    public void setModeratorId(Long moderatorId) {
        this.moderatorId = moderatorId;
    }

    public String getModeratorComment() {
        return moderatorComment;
    }

    public void setModeratorComment(String moderatorComment) {
        this.moderatorComment = moderatorComment;
    }

    public String getMeetingID() {
        return meetingID;
    }

    public void setMeetingID(String meetingID) {
        this.meetingID = meetingID;
    }

    public String getInternalMeetingID() {
        return internalMeetingID;
    }

    public void setInternalMeetingID(String internalMeetingID) {
        this.internalMeetingID = internalMeetingID;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public String getLectionName() {
        return lectionName;
    }

    public void setLectionName(String lectionName) {
        this.lectionName = lectionName;
    }

    public String getLectionDescription() {
        return lectionDescription;
    }

    public void setLectionDescription(String lectionDescription) {
        this.lectionDescription = lectionDescription;
    }

    public String getLectionUrl() {
        return lectionUrl;
    }

    public void setLectionUrl(String lectionUrl) {
        this.lectionUrl = lectionUrl;
    }

    public Integer getLectionPosition() {
        return lectionPosition;
    }

    public void setLectionPosition(Integer lectionPosition) {
        this.lectionPosition = lectionPosition;
    }

    public Long getCourceId() {
        return courceId;
    }

    public void setCourceId(Long courceId) {
        this.courceId = courceId;
    }

    public Cource getCource() {
        return cource;
    }

    public void setCource(Cource cource) {
        this.cource = cource;
    }

    public String getJoinUrl() {
        return joinUrl;
    }

    public void setJoinUrl(String joinUrl) {
        this.joinUrl = joinUrl;
    }
    public String getLectionUrlForRecord() {
        return lectionUrlForRecord;
    }

    public void setLectionUrlForRecord(String lectionUrlForRecord) {
        this.lectionUrlForRecord = lectionUrlForRecord;
    }
    public Integer getMeetingStatus() {
        return meetingStatus;
    }

    public void setMeetingStatus(Integer meetingStatus) {
        this.meetingStatus = meetingStatus;
    }

    public Integer getRecordStatus() {
        return recordStatus;
    }

    public void setRecordStatus(Integer recordStatus) {
        this.recordStatus = recordStatus;
    }
    public String getLectionCreateUrl() {
        return lectionCreateUrl;
    }
    public void setLectionCreateUrl(String lectionCreateUrl) {
        this.lectionCreateUrl = lectionCreateUrl;
    }

    public Integer getLectionRewrite() {
        return lectionRewrite;
    }

    public void setLectionRewrite(Integer lectionRewrite) {
        this.lectionRewrite = lectionRewrite;
    }
    public Long getAuthorId() {
        return authorId;
    }


    public void setMailForReport(String mailForReport) {
        this.mailForReport = mailForReport;
    }
    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public String getMailForReport() {
        return mailForReport;
    }
    public LocalDateTime getLectionCreateDateTime() {
        return lectionCreateDateTime;
    }

    public void setLectionCreateDateTime(LocalDateTime lectionCreateDateTime) {
        this.lectionCreateDateTime = lectionCreateDateTime;
    }
    public Long getUserGroup() {
        return userGroup;
    }

    public void setUserGroup(Long userGroup) {
        this.userGroup = userGroup;
    }

    public Lection(){
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UserGroup getuGroup() {
        return uGroup;
    }

    public void setuGroup(UserGroup uGroup) {
        this.uGroup = uGroup;
    }


    public Long getWhoDeleted() {
        return whoDeleted;
    }

    public void setWhoDeleted(Long whoDeleted) {
        this.whoDeleted = whoDeleted;
    }

    public LocalDateTime getDeleteDate() {
        return deleteDate;
    }

    public void setDeleteDate(LocalDateTime deleteDate) {
        this.deleteDate = deleteDate;
    }


    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }








}
