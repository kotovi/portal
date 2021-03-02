package ru.geekbase.portal.domain;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlTransient;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name="Question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(QuestionView.ForLector.class)
    private Long id;
    @JsonView(QuestionView.ForLector.class)
    private Long testId;

    @JsonIgnoreProperties(value={ "questions", "cource"})
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "testId", insertable = false, updatable = false)
    @JsonView(QuestionView.ForLector.class)
    private Test test;

    @JsonView(QuestionView.ForStudent.class)
    @Column (length = 3000)
    private String questionBody;

    @JsonView(QuestionView.ForStudent.class)
    @Column (length = 3000)
    private String enQuestionBody;

    @JsonView({LectionView.MinimalList.class,QuestionView.ForStudent.class})
    private Integer answersCount;

    @JsonView(QuestionView.ForLector.class)
    private Long creatorId;


    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "questionId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonView({LectionView.MinimalList.class, QuestionView.ForStudent.class})
    private List<Answer> answers;

    public Question(){

    }


    public Question(Long id,
                    Long testId,
                    String questionBody,
                    Integer answersCount,
                    Test test,
                    Long creatorId,
                    List<Answer> answers,
                    String enQuestionBody){
        this.id=id;
        this.testId=testId;
        this.questionBody =questionBody;
        this.answersCount=answersCount;
        this.test=test;
        this.creatorId = creatorId;
        this.answers = answers;
        this.enQuestionBody = enQuestionBody;

    }

    public String getEnQuestionBody() {
        return enQuestionBody;
    }

    public void setEnQuestionBody(String enQuestionBody) {
        this.enQuestionBody = enQuestionBody;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

   // public void setAnswers(List<Answer> answers) {
   //     this.answers = answers;
   // }

    public Test getTest() {
        return test;
    }

    public void setTest(Test test) {
        this.test = test;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    };

    public Long getTestId() {

        return testId;
    }




    public String getQuestionBody() {
        return questionBody;
    }

    public void setQuestionBody(String questionBody) {
        this.questionBody = questionBody;
    }

    public Integer getAnswersCount() {
        return answersCount;
    }

    public void setAnswersCount(Integer answersCount) {
        this.answersCount = answersCount;
    }
    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }


}
