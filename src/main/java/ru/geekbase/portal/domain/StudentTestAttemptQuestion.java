package ru.geekbase.portal.domain;


import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "student_test_attempt_question")
public class StudentTestAttemptQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(QuestionView.ForStudent.class)
    private Long id;
    @JsonView(QuestionView.ForStudent.class)
    private Long studentTestAttemptId;
    @JsonView(QuestionView.ForStudent.class)
    private Long questionId;
    @JsonView(QuestionView.ForStudent.class)
    private Boolean questionIsHurd;
    @JsonView(QuestionView.ForStudent.class)
    private String questionBody;

    @JsonView(QuestionView.ForStudent.class)
    private String enQuestionBody;

   // @ManyToOne(fetch = FetchType.EAGER)
   // @JoinColumn(name = "questionId", insertable = false, updatable = false)
   // @JsonView(QuestionView.ForStudent.class)
   // private Question question;

   // @JsonView(QuestionView.ForStudent.class)
   // @OneToMany(fetch = FetchType.EAGER)
   // @JoinColumn(name = "studentTestAttemptId")
   // private List<StudentTestAttemptAnswer> studentTestAttemptAnswers;

    @JsonView(QuestionView.ForStudent.class)
    @OneToMany(mappedBy = "studentTestAttemptQuestion")
    private List<StudentTestAttemptAnswer> studentTestAttemptAnswers;

    @ManyToOne
    @JoinColumn(name = "studentTestAttemptId",nullable=false , insertable = false, updatable = false)
    private StudentTestAttempt studentTestAttempt;

    public StudentTestAttemptQuestion(Long id,
                                      Long studentTestAttemptId,
                                      Long questionId,
                                      List<StudentTestAttemptAnswer> studentTestAttemptAnswers,
                                      String questionBody,
                                      Boolean questionIsHurd,
                                      String enQuestionBody){
        this.enQuestionBody = enQuestionBody;
        this.id = id;
        this.studentTestAttemptId = studentTestAttemptId;
        this.questionId = questionId;

        this.questionBody = questionBody;
        this.questionIsHurd = questionIsHurd;

        this.studentTestAttemptAnswers = studentTestAttemptAnswers;
    }

    public StudentTestAttemptQuestion() {

    }

    public String getEnQuestionBody() {
        return enQuestionBody;
    }

    public void setEnQuestionBody(String enQuestionBody) {
        this.enQuestionBody = enQuestionBody;
    }

    public List<StudentTestAttemptAnswer> getStudentTestAttemptAnswers() {
        return studentTestAttemptAnswers;
    }

    public void setStudentTestAttemptAnswers(List<StudentTestAttemptAnswer> studentTestAttemptAnswers) {
        this.studentTestAttemptAnswers = studentTestAttemptAnswers;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentTestAttemptId() {
        return studentTestAttemptId;
    }

    public void setStudentTestAttemptId(Long studentTestAttemptId) {
        this.studentTestAttemptId = studentTestAttemptId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Boolean getQuestionIsHurd() {
        return questionIsHurd;
    }

    public void setQuestionIsHurd(Boolean questionIsHurd) {
        this.questionIsHurd = questionIsHurd;
    }

    public String getQuestionBody() {
        return questionBody;
    }

    public void setQuestionBody(String questionBody) {
        this.questionBody = questionBody;
    }
}
