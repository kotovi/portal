package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="cource")
public class Cource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(LectionView.MinimalList.class)
    private Long id;
    @JsonView(LectionView.MinimalList.class)
    private Long creatorId;

    @JsonView(LectionView.MinimalList.class)
    private Long testId;

    @JsonView(LectionView.MinimalList.class)
    private Long finalTestId;

    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "creatorId", insertable = false, updatable = false )
    @JsonView(LectionView.MinimalList.class)
    private User user;

    @JsonView(LectionView.MinimalList.class)
    @Column (length = 3000)
    private String courceName;

    @JsonView(LectionView.MinimalList.class)
    @Column (length = 3000)
    private String enCourceName;

    @JsonView(LectionView.MinimalList.class)
    @Column (length = 3000)
    private String courceDescription;

    @JsonView(LectionView.MinimalList.class)
    @Column (length = 3000)
    private String enCourceDescription;


    @JsonView(LectionView.MinimalList.class)
    private Integer lectionsCount;
    @JsonView(LectionView.MinimalList.class)
    private Integer testEnable;
    @JsonView(LectionView.ForFront.class)
    private Long userGroup;
    @JsonView(LectionView.ForFront.class)
    private  boolean isDeleted;
    @JsonView(LectionView.FullMessage.class)
    private Long whoDeleted;



    @JsonView(LectionView.FullMessage.class)
    private LocalDateTime deleteDate;

    @JsonView(LectionView.ForFront.class)
    private Boolean isModerated;
    @JsonView(LectionView.ForFront.class)
    private Long moderatorId;
    @JsonView(LectionView.ForFront.class)
    private String moderatorComment;

    @OneToMany(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value={ "cource"})
    @JoinColumn(name = "courceId")
    @Where(clause = "deleted = false")
    @JsonView({LectionView.MinimalList.class, QuestionView.ForLector.class})
    private List<Lection> lections;

   // @OneToMany(fetch = FetchType.EAGER)
   // @JsonIgnoreProperties(value={ "cource","lections","tests","user", "userGroup","tests", "lection"})
   // @JoinColumn(name = "courceId")
   // @JsonView({LectionView.ForFront.class, QuestionView.ForLector.class})
   // private List<Test> noLectionTests;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "testId", insertable = false, updatable = false)
    @JsonView(LectionView.ForFront.class)
    @JsonIgnoreProperties(value={ "lections", "test"})
    private Test test;



    public Cource() {
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Cource(Long id,
                  Long creatorId,
                  Long testId,
                  Long finalTestId,
                  Integer lectionsCount,
                  String courceName,
                  String courceDescription,
                  Integer testEnable,
                  Long userGroup,
                  Boolean isDeleted,
                  Long whoDeleted,
                  LocalDateTime deleteDate,
                  User user,
                  Boolean isModerated,
                  Long moderatorId,
                  String moderatorComment,
                  List <Lection> lections,
                  Test test,
                  String enCourceName,
                  String enCourceDescription){
        this.id=id;
        this.creatorId = creatorId;
        this.testId = testId;
        this.finalTestId = finalTestId;
        this.lectionsCount = lectionsCount;
        this.courceName = courceName;
        this.courceDescription = courceDescription;
        this.testEnable = testEnable;
        this.userGroup=userGroup;
        this.isDeleted = isDeleted;
        this.whoDeleted = whoDeleted;
        this.deleteDate = deleteDate;
        this.user = user;
        this.isModerated = isModerated;
        this.moderatorId = moderatorId;
        this.moderatorComment = moderatorComment;
        this.lections = lections;
        this.test = test;
        this.enCourceName = enCourceName;
        this.courceDescription = enCourceDescription;

    }

    public String getEnCourceName() {
        return enCourceName;
    }

    public void setEnCourceName(String enCourceName) {
        this.enCourceName = enCourceName;
    }

    public String getEnCourceDescription() {
        return enCourceDescription;
    }

    public void setEnCourceDescription(String enCourceDescription) {
        this.enCourceDescription = enCourceDescription;
    }

    public Test getTest() {
        return test;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public Long getFinalTestId() {
        return finalTestId;
    }

    public void setFinalTestId(Long finalTestId) {
        this.finalTestId = finalTestId;
    }

    public List<Lection> getLections() {
        return lections;
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

    public String getCourceDescription() {
        return courceDescription;
    }

    public void setCourceDescription(String courceDescription) {
        this.courceDescription = courceDescription;
    }

    public Integer getTestEnable() {
        return testEnable;
    }

    public void setTestEnable(Integer testEnable) {
        this.testEnable = testEnable;
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

    public Integer getLectionsCount() {
        return lectionsCount;
    }

    public void setLectionsCount(Integer lectionsCount) {
        this.lectionsCount = lectionsCount;
    }

    public String getCourceName() {
        return courceName;
    }

    public void setCourceName(String courceName) {
        this.courceName = courceName;
    }
    public Long getUserGroup() {
        return userGroup;
    }

    public void setUserGroup(Long userGroup) {
        this.userGroup = userGroup;
    }
    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
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


}
