package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public class LectionListForStudent {

    private Long id;
    private String courceName;
    private String enCourceName;
    private String lectionName;
    private String enLectionName;
    private String lectionUrl;
    private String testUrl;
    private Boolean testSuccess;
    private Integer testType;
    private Boolean accessBegin;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime accessBeginDate;
    private List<File>  fileList;


    public LectionListForStudent(){

    }

    public LectionListForStudent(Long id,
                                 String courceName,
                                 String enCourceName,
                                 String lectionName,
                                 String enLectionName,
                                 String lectionUrl,
                                 String testUrl,
                                 Boolean testSuccess,
                                 Integer testType,
                                 Boolean accessBegin,
                                 LocalDateTime accessBeginDate,
                                 List<File>  fileList){
        this.id = id;
        this.courceName =courceName;
        this.enCourceName = enCourceName;
        this.lectionName = lectionName;
        this.lectionUrl = lectionUrl;
        this.testSuccess = testSuccess;
        this.testUrl = testUrl;
        this.testType = testType;
        this.accessBegin =accessBegin;
        this.accessBeginDate = accessBeginDate;
        this.fileList = fileList;
        this.enLectionName = enLectionName;
    }

    public String getEnCourceName() {
        return enCourceName;
    }

    public void setEnCourceName(String enCourceName) {
        this.enCourceName = enCourceName;
    }

    public String getEnLectionName() {
        return enLectionName;
    }

    public void setEnLectionName(String enLectionName) {
        this.enLectionName = enLectionName;
    }

    public List<File> getFileList() {
        return fileList;
    }

    public void setFileList(List<File> fileList) {
        this.fileList = fileList;
    }

    public Boolean getAccessBegin() {
        return accessBegin;
    }

    public void setAccessBegin(Boolean accessBegin) {
        this.accessBegin = accessBegin;
    }

    public LocalDateTime getAccessBeginDate() {
        return accessBeginDate;
    }

    public void setAccessBeginDate(LocalDateTime accessBeginDate) {
        this.accessBeginDate = accessBeginDate;
    }

    public Integer getTestType() {
        return testType;
    }

    public void setTestType(Integer testType) {
        this.testType = testType;
    }

    public String getTestUrl() {
        return testUrl;
    }

    public void setTestUrl(String testUrl) {
        this.testUrl = testUrl;
    }

    public Boolean getTestSuccess() {
        return testSuccess;
    }

    public void setTestSuccess(Boolean testSuccess) {
        this.testSuccess = testSuccess;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourceName() {
        return courceName;
    }

    public void setCourceName(String courceName) {
        this.courceName = courceName;
    }

    public String getLectionName() {
        return lectionName;
    }

    public void setLectionName(String lectionName) {
        this.lectionName = lectionName;
    }

    public String getLectionUrl() {
        return lectionUrl;
    }

    public void setLectionUrl(String lectionUrl) {
        this.lectionUrl = lectionUrl;
    }




}
