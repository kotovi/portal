package ru.geekbase.portal.domain;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="cource_listener")
public class CourceListener {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long creatorId;
    private Long listenerId;
    private Long courceId;
    private LocalDateTime creationDate;
    private LocalDateTime beginDate;
    private LocalDateTime endDate;

    public CourceListener(){}

    public CourceListener(Long id, Long creatorId, Long listenerId, Long courceId, LocalDateTime creationDate,
                          LocalDateTime beginDate, LocalDateTime endDate){
        this.id = id;
        this.creatorId = creatorId;
        this.listenerId = listenerId;
        this.courceId = courceId;
        this.creationDate = creationDate;
        this.beginDate = beginDate;
        this.endDate = endDate;
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

    public Long getListenerId() {
        return listenerId;
    }

    public void setListenerId(Long listenerId) {
        this.listenerId = listenerId;
    }

    public Long getCourceId() {
        return courceId;
    }

    public void setCourceId(Long courceId) {
        this.courceId = courceId;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
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


}
