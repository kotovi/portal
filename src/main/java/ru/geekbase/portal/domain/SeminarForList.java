package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonView;

import java.time.LocalDateTime;

public class SeminarForList {
    @JsonView(LectionView.MinimalList.class)
    private Long id;
    @JsonView(LectionView.MinimalList.class)
    private String seminarName;
    @JsonView(LectionView.MinimalList.class)
    private String seminarCreator;
    @JsonView(LectionView.MinimalList.class)
    private Integer meetingStatus;
    @JsonView(LectionView.MinimalList.class)
    private String recordUrl;
    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime seminarBeginDate;


    public SeminarForList() {

    }
    public SeminarForList(Long id,
                          String seminarName,
                          String seminarCreator,
                          LocalDateTime seminarBeginDate,
                          Integer meetingStatus,
                          String recordUrl) {
        this.id = id;
        this.seminarName = seminarName;
        this.seminarCreator = seminarCreator;
        this.seminarBeginDate = seminarBeginDate;
        this.meetingStatus = meetingStatus;
        this.recordUrl = recordUrl;
    }

    public String getRecordUrl() {
        return recordUrl;
    }

    public void setRecordUrl(String recordUrl) {
        this.recordUrl = recordUrl;
    }

    public Integer getMeetingStatus() {
        return meetingStatus;
    }

    public void setMeetingStatus(Integer meetingStatus) {
        this.meetingStatus = meetingStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeminarName() {
        return seminarName;
    }

    public void setSeminarName(String seminarName) {
        this.seminarName = seminarName;
    }

    public String getSeminarCreator() {
        return seminarCreator;
    }

    public void setSeminarCreator(String seminarCreator) {
        this.seminarCreator = seminarCreator;
    }

    public LocalDateTime getSeminarBeginDate() {
        return seminarBeginDate;
    }

    public void setSeminarBeginDate(LocalDateTime seminarBeginDate) {
        this.seminarBeginDate = seminarBeginDate;
    }
}
