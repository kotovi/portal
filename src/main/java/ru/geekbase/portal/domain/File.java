package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonView;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="file")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(LectionView.MinimalList.class)
    private Long id;
    @JsonView(LectionView.MinimalList.class)
    private String fileName;
    @JsonView(LectionView.MinimalList.class)
    private String fileDescription;
    @JsonView(LectionView.MinimalList.class)
    private String randomFileName;
    @JsonView(LectionView.MinimalList.class)
    private Long creatorId;
    @JsonView(LectionView.MinimalList.class)
    private Long lectionId;
    @JsonView(LectionView.MinimalList.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createDateTime;

    @ManyToOne(fetch = FetchType.LAZY )
    @JoinColumn(name = "creatorId", insertable = false, updatable = false)
    @JsonIgnoreProperties(value={ "roles",
            "userAgreement",
            "personalDataAgree",
            "idInMirIsmu",
            "userGroup",
            "userStudyGroupInMirIsmu",
            "phoneNumber",
            "notificationAgree",
            "userRole",
            "userEmail"
    })
    @JsonView(LectionView.MinimalList.class)
    private User user;


    public File(String fileName,
                String fileDescription,
                String randomFileName,
                Long creatorId,
                Long lectionId,
                LocalDateTime createDateTime,
                User user
    ) {
        this.fileName = fileName;
        this.fileDescription = fileDescription;
        this.randomFileName = randomFileName;
        this.creatorId = creatorId;
        this.lectionId = lectionId;
        this.createDateTime = createDateTime;
        this.user = user;

    }

    public File() {
    }



    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileDescription() {
        return fileDescription;
    }

    public void setFileDescription(String fileDescription) {
        this.fileDescription = fileDescription;
    }

    public String getRandomFileName() {
        return randomFileName;
    }

    public void setRandomFileName(String randomFileName) {
        this.randomFileName = randomFileName;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }


    public Long getLectionId() {
        return lectionId;
    }

    public void setLectionId(Long lectionId) {
        this.lectionId = lectionId;
    }

    public LocalDateTime getCreateDateTime() {
        return createDateTime;
    }

    public void setCreateDateTime(LocalDateTime createDateTime) {
        this.createDateTime = createDateTime;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
