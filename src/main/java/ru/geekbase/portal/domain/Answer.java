package ru.geekbase.portal.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table(name="Answer")
public class Answer implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(QuestionView.ForStudent.class)
    private Long id;

    @JsonView(QuestionView.ForLector.class)
    private Long questionId;

    @JsonView(QuestionView.ForLector.class)
    private Long testId;


    @JsonView(QuestionView.ForStudent.class)
    @Column (length = 3000)
    private String answerBody;

    @JsonView(QuestionView.ForStudent.class)
    @Column (length = 3000)
    private String enAnswerBody;

    @JsonView(QuestionView.ForLector.class)
    private Integer answerIsTrue;

    @JsonView(QuestionView.ForLector.class)
    private Long creatorId;

    @JsonIgnoreProperties(value={ "questions", "cource", "answers", "test"})
    //@XmlTransient
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "questionId", insertable = false, updatable = false)
    @JsonView(QuestionView.ForLector.class)
    private Question question;

    public Answer(){

    }
    public Answer(Long id,
                  Long questionId,
                  String answerBody,
                  Integer answerIsTrue,
                  Long creatorId,
                  Long testId,
                  Question question,
                  String enAnswerBody
    ){
        this.id=id;
        this.creatorId = creatorId;
        this.questionId=questionId;
        this.answerBody=answerBody;
        this.answerIsTrue=answerIsTrue;
        this.testId = testId;
        this.question = question;
        this.enAnswerBody = enAnswerBody;
    }

    public String getEnAnswerBody() {
        return enAnswerBody;
    }

    public void setEnAnswerBody(String enAnswerBody) {
        this.enAnswerBody = enAnswerBody;
    }

    public Question getQuestion() {
        return question;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getAnswerBody() {
        return answerBody;
    }

    public void setAnswerBody(String answerBody) {
        this.answerBody = answerBody;
    }

    public Integer getAnswerIsTrue() {
        return answerIsTrue;
    }

    public void setAnswerIsTrue(Integer answerIsTrue) {
        this.answerIsTrue = answerIsTrue;
    }
    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }
    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }




}
