package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name="student_test_attempt")
public class StudentTestAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView({QuestionView.ForStudent.class, LectionView.MinimalList.class})
    private Long id;
    @JsonView({QuestionView.ForStudent.class, LectionView.MinimalList.class})
    private Long lectionId;

    @JsonView({QuestionView.ForLector.class, LectionView.MinimalList.class, LectionView.ForLectionList.class} )
    @OneToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "lectionId", insertable = false, updatable = false )
    @JsonIgnoreProperties(value={ "tests", "files"})
    private Lection lection;


    @JsonView({QuestionView.ForStudent.class, LectionView.MinimalList.class})
    private Long courceId;
    @JsonView({QuestionView.ForStudent.class, LectionView.MinimalList.class})
    private Integer testType;
    @JsonView({QuestionView.ForStudent.class, LectionView.MinimalList.class})
    private Long studentId;



    @JsonView({QuestionView.ForStudent.class, LectionView.MinimalList.class})
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime beginDate;
    @JsonView({QuestionView.ForStudent.class, LectionView.MinimalList.class})
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endDate;
    @JsonView({QuestionView.ForStudent.class, LectionView.MinimalList.class})
    private Integer finalBall;
    @JsonView({QuestionView.ForStudent.class, LectionView.MinimalList.class})
    private Boolean userFinalBallConfirm;
    @JsonView({QuestionView.ForStudent.class, LectionView.MinimalList.class})
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime userFinalBallConfirmDate;

    @JsonView({QuestionView.ForLector.class, LectionView.MinimalList.class, LectionView.ForLectionList.class} )
    @OneToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "studentId", insertable = false, updatable = false )
    private User user;


    @JsonView(QuestionView.ForStudent.class)
    @OneToMany(mappedBy = "studentTestAttempt")
    private List<StudentTestAttemptQuestion> studentTestAttemptQuestions;

    public StudentTestAttempt(){ }

    public StudentTestAttempt(Long id,
                              Long lectionId,
                              Long studentId,
                              LocalDateTime beginDate,
                              LocalDateTime endDate,
                              Integer finalBall,
                              List<StudentTestAttemptQuestion> studentTestAttemptQuestions,
                              Boolean userFinalBallConfirm,
                              LocalDateTime userFinalBallConfirmDate,
                              Long courceId,
                              Integer testType,
                              User user){
        this.id = id;
        this.lectionId = lectionId;
        this.studentId = studentId;
        this.beginDate = beginDate;
        this.endDate = endDate;
        this.finalBall = finalBall;
        this.studentTestAttemptQuestions = studentTestAttemptQuestions;
        this.userFinalBallConfirm = userFinalBallConfirm;
        this.userFinalBallConfirmDate = userFinalBallConfirmDate;
        this.courceId = courceId;
        this.testType = testType;
        this.user = user;

    }

    public User getUser() {
        return user;
    }

    public Long getCourceId() {
        return courceId;
    }

    public void setCourceId(Long courceId) {
        this.courceId = courceId;
    }

    public Integer getTestType() {
        return testType;
    }

    public void setTestType(Integer testType) {
        this.testType = testType;
    }

    public List<StudentTestAttemptQuestion> getStudentTestAttemptQuestions() {
        return studentTestAttemptQuestions;
    }

    public void setStudentTestAttemptQuestions(List<StudentTestAttemptQuestion> studentTestAttemptQuestions) {
        this.studentTestAttemptQuestions = studentTestAttemptQuestions;
    }

    public Boolean getUserFinalBallConfirm() {
        return userFinalBallConfirm;
    }

    public void setUserFinalBallConfirm(Boolean userFinalBallConfirm) {
        this.userFinalBallConfirm = userFinalBallConfirm;
    }

    public LocalDateTime getUserFinalBallConfirmDate() {
        return userFinalBallConfirmDate;
    }

    public void setUserFinalBallConfirmDate(LocalDateTime userFinalBallConfirmDate) {
        this.userFinalBallConfirmDate = userFinalBallConfirmDate;
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

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public LocalDateTime getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(LocalDateTime beginDate) {
        this.beginDate = beginDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public Integer getFinalBall() {
        return finalBall;
    }

    public void setFinalBall(Integer finalBall) {
        this.finalBall = finalBall;
    }
}

