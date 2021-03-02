package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name="test")
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView({LectionView.ForFront.class, QuestionView.ForLector.class})
    private Long id;

    @JsonView({LectionView.ForFront.class, QuestionView.ForLector.class})
    private Integer questionsCount;

    @JsonView({LectionView.ForFront.class, QuestionView.ForLector.class})
    private Integer questionsCountForUser;

    @JsonView({LectionView.ForFront.class, QuestionView.ForLector.class})
    private Integer defaultTest;

    @JsonView({LectionView.ForFront.class, QuestionView.ForLector.class})
    private String testName;

    @JsonView(LectionView.ForFront.class)
    private Integer minimalBall;

    @JsonView(LectionView.ForFront.class)
    private String testDescription;

    @JsonView({LectionView.ForFront.class, QuestionView.ForLector.class})
    private Long lectionId;

    @JsonView({LectionView.FullMessage.class, QuestionView.ForLector.class})
    private Long creatorId;

    @JsonView({LectionView.FullMessage.class, QuestionView.ForLector.class})
    private Long userGroupId;


    @JsonView({LectionView.FullMessage.class, QuestionView.ForLector.class})
    private Long courceId;

    @JsonView({LectionView.FullMessage.class, QuestionView.ForLector.class, LectionView.MinimalList.class})
    private Integer testType;

    @OneToMany(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value={})
    @JoinColumn(name = "testId", insertable = false, updatable = false)
    @JsonView({QuestionView.ForLector.class, LectionView.ForFront.class})
    private List<Cource> cources;


    @OneToMany(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value={ "cource", "test","user"})
    @JoinColumn(name = "testId", insertable = false, updatable = false)
    @JsonView({QuestionView.ForLector.class, LectionView.ForFront.class})
    private List<Lection> lections;


    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "testId")
    @JsonView({LectionView.ForFront.class, QuestionView.ForLector.class})
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Question> questions;

    public Test(){

    }

    public Test(Long id,
                Long lectionId,
                Long userGroupId,
                Integer questionsCount,
                Integer questionsCountForUser,
                Integer defaultTest,
                String testName,
                String testDescription,
                List<Lection> lections,
                Long creatorId,
                Integer minimalBall,
               // Cource cource,
                Long courceId,
                Integer testType,
                List<Question> questions){
        this.id=id;
        this.lectionId=lectionId;
        this.questionsCount=questionsCount;
        this.questionsCountForUser=questionsCountForUser;
        this.defaultTest = defaultTest;
        this.testName = testName;
        this.testDescription = testDescription;
        this.lections = lections;
        this.creatorId = creatorId;
        this.minimalBall = minimalBall;
        this.courceId = courceId;
        this.testType = testType;
       // this.cource=cource;
        this.questions = questions;
        this.userGroupId = userGroupId;
    }

    public Long getUserGroupId() {
        return userGroupId;
    }

    public void setUserGroupId(Long userGroupId) {
        this.userGroupId = userGroupId;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public Integer getTestType() {
        return testType;
    }

    public void setTestType(Integer testType) {
        this.testType = testType;
    }

    public Long getCourceId() {
        return courceId;
    }

    public void setCourceId(Long courceId) {
        this.courceId = courceId;
    }
/*
    public Cource getCource() {
        return cource;
    }

    public void setCource(Cource cource) {
        this.cource = cource;
    }
*/
    public Integer getMinimalBall() {
        return minimalBall;
    }

    public void setMinimalBall(Integer minimalBall) {
        this.minimalBall = minimalBall;
    }


    public List<Lection> getLections() {
        return lections;
    }

    public void setLections(List<Lection> lections) {
        this.lections = lections;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLectionId() {
        return lectionId;
    }

    public void setLectionId(Long lectionId) {
        this.lectionId = lectionId;
    }

    public Integer getQuestionsCount() {
        return questionsCount;
    }

    public void setQuestionsCount(Integer questionsCount) {
        this.questionsCount = questionsCount;
    }

    public Integer getQuestionsCountForUser() {
        return questionsCountForUser;
    }

    public void setQuestionsCountForUser(Integer questionsCountForUser) {
        this.questionsCountForUser = questionsCountForUser;
    }

    public Integer getDefaultTest() {
        return defaultTest;
    }

    public void setDefaultTest(Integer defaultTest) {
        this.defaultTest = defaultTest;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getTestDescription() {
        return testDescription;
    }

    public void setTestDescription(String testDescription) {
        this.testDescription = testDescription;
    }
    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }
}

