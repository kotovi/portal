package ru.geekbase.portal.domain;

import javax.persistence.*;

@Entity
@Table(name="listener_test")
public class ListenerTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long lectionListenerId;
    private Long questionId;

    public  ListenerTest(){}

    public  ListenerTest(Long id, Long lectionListenerId, Long questionId){
        this.id = id;
        this.lectionListenerId = lectionListenerId;
        this.questionId = questionId;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLectionListenerId() {
        return lectionListenerId;
    }

    public void setLectionListenerId(Long lectionListenerId) {
        this.lectionListenerId = lectionListenerId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

}
