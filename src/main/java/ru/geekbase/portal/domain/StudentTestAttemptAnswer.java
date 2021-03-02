package ru.geekbase.portal.domain;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;

@Entity
@Table(name="student_test_attempt_answer")
public class StudentTestAttemptAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(QuestionView.ForStudent.class)
    private Long id;
    @JsonView(QuestionView.ForStudent.class)
    private Long studentTestAttemptQuestionId;
    @JsonView(QuestionView.ForStudent.class)
    private Long questionId;

    @JsonView(QuestionView.ForStudent.class)
    private Long answerId;

    @OneToOne
    @JsonView(QuestionView.ForLector.class)
    @JoinColumn(name="answerId", insertable = false, updatable = false)
    @JsonIgnoreProperties(value={ "question", "id","questionId","testId","answerBody", "creatorId"})
    private Answer originalAnswer;

    @JsonView(QuestionView.ForStudent.class)
    private Boolean answerIsTrue;

    @JsonView(QuestionView.ForStudent.class)
    private String answerBody;

    @JsonView(QuestionView.ForStudent.class)
    private String enAnswerBody;

    //@ManyToOne(fetch = FetchType.EAGER)
    //@JoinColumn(name = "id", insertable = false, updatable = false)
    //@JsonView(QuestionView.ForStudent.class)
    //private StudentTestAttempt studentTestAttempt;

    @ManyToOne
    @JoinColumn(name = "studentTestAttemptQuestionId",nullable=false , insertable = false, updatable = false)
    private StudentTestAttemptQuestion studentTestAttemptQuestion;


    public StudentTestAttemptAnswer() {

    }
    public StudentTestAttemptAnswer(Long id,
                                    Long studentTestAttemptQuestionId ,
                                    Long questionId,
                                    Long answerId,
                                    Boolean answerIsTrue,
                                    String answerBody,
                                    String enAnswerBody) {
        this.id = id;
        this.studentTestAttemptQuestionId =studentTestAttemptQuestionId;
        this.questionId = questionId;
        this.answerId = answerId;
        this.answerIsTrue =answerIsTrue;
        this.answerBody = answerBody;
        this.enAnswerBody = answerBody;
    }

    public String getEnAnswerBody() {
        return enAnswerBody;
    }

    public void setEnAnswerBody(String enAnswerBody) {
        this.enAnswerBody = enAnswerBody;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public Long getStudentTestAttemptQuestionId() {
        return studentTestAttemptQuestionId;
    }

    public void setStudentTestAttemptQuestionId(Long studentTestAttemptQuestionId) {
        this.studentTestAttemptQuestionId = studentTestAttemptQuestionId;
    }

    public StudentTestAttemptQuestion getStudentTestAttemptQuestion() {
        return studentTestAttemptQuestion;
    }

    public void setStudentTestAttemptQuestion(StudentTestAttemptQuestion studentTestAttemptQuestion) {
        this.studentTestAttemptQuestion = studentTestAttemptQuestion;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getAnswerId() {
        return answerId;
    }

    public void setAnswerId(Long answerId) {
        this.answerId = answerId;
    }

    public Boolean getAnswerIsTrue() {
        return answerIsTrue;
    }

    public void setAnswerIsTrue(Boolean answerIsTrue) {
        this.answerIsTrue = answerIsTrue;
    }

    public String getAnswerBody() {
        return answerBody;
    }

    public void setAnswerBody(String answerBody) {
        this.answerBody = answerBody;
    }
}
