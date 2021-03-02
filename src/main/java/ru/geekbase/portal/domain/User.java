package ru.geekbase.portal.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Set;

@Entity
@Table(name = "usr")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonView(LectionView.ForFront.class)
    private Long id;

    @JsonView(LectionView.ForLectionList.class )
    private String username;

    @JsonView(LectionView.FullMessage.class)
    private String password;

    @JsonView(LectionView.ForLectionList.class)
    private boolean active;

    @JsonView({LectionView.MinimalList.class, QuestionView.ForLector.class})
    private String firstname;

    @JsonView({LectionView.MinimalList.class, QuestionView.ForLector.class})
    private String lastname;

    @JsonView({LectionView.MinimalList.class, QuestionView.ForLector.class})
    private String secname;

    @JsonView(LectionView.ForFront.class)
    private String userEmail;

    @JsonView(LectionView.ForFront.class)
    private Integer userRole;

    @JsonView({LectionView.MinimalList.class, QuestionView.ForLector.class})
    private Long userGroup;


    @ElementCollection(targetClass = Roles.class, fetch = FetchType.EAGER)
    @CollectionTable(name ="user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @JsonView(LectionView.ForFront.class)
    private Set<Roles> roles;

    @JsonView(LectionView.FullMessage.class)
    private Boolean isDeleted;

    @JsonView(LectionView.FullMessage.class)
    private Long whoDeleted;

    @JsonView(LectionView.FullMessage.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime deleteDate;

    @JsonView(LectionView.FullMessage.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registrationDate;

    @JsonView(LectionView.FullMessage.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastPasswordResetRequestDate;

    @JsonView(LectionView.ForFront.class)
    private Boolean notificationAgree;

    @JsonView(LectionView.FullMessage.class)
    private String notificationUUID;

    @JsonView(LectionView.FullMessage.class)
    private String passwordResetUUID;

    @JsonView(LectionView.ForFront.class)
    private Boolean userAgreement;

    @JsonView(LectionView.ForFront.class)
    private Boolean personalDataAgree;

    @JsonView(LectionView.ForFront.class)
    private String phoneNumber;

    @JsonView({LectionView.MinimalList.class, QuestionView.ForLector.class})
    private Long idInMirIsmu;

    @JsonView({LectionView.ForFront.class, LectionView.MinimalList.class, QuestionView.ForLector.class})
    private String userStudyGroupInMirIsmu;

    @Override
    @JsonView(LectionView.FullMessage.class)
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonView(LectionView.FullMessage.class)
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonView(LectionView.FullMessage.class)
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonView(LectionView.FullMessage.class)
    public boolean isEnabled() {
        return isActive();
    }
//think about this
    @Override
    @JsonView(LectionView.FullMessage.class)
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return getRoles();


    }


    public User(){

    }


    public void setPasswordResetUUID(String passwordResetUUID) {
        this.passwordResetUUID = passwordResetUUID;
    }

    public Boolean getPersonalDataAgree() {
        return personalDataAgree;
    }

    public void setPersonalDataAgree(Boolean personalDataAgree) {
        this.personalDataAgree = personalDataAgree;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public User(Long id, String username, String password, Boolean active, String firstname, String lastname,
                String userEmail, Integer userRole, Long userGroup, Boolean isDeleted, Long whoDeleted, LocalDateTime deleteDate,
                String passwordResetUUID, String notificationUUID, Boolean notificationAgree, LocalDateTime lastPasswordResetRequestDate,
                LocalDateTime registrationDate, String secname, Boolean userAgreement, Boolean personalDataAgree, String phoneNumber,
                Long idInMirIsmu,String userStudyGroupInMirIsmu){
        this.id=id;
        this.username=username;
        this.password=password;
        this.active=active;
        this.firstname = firstname;
        this.lastname = lastname;
        this.userEmail = userEmail;
        this.userRole = userRole;
        this.userGroup =userGroup;
        this.deleteDate = deleteDate;
        this.whoDeleted = whoDeleted;
        this.isDeleted = isDeleted;
        this.lastPasswordResetRequestDate = lastPasswordResetRequestDate;
        this.notificationAgree=notificationAgree;
        this.notificationUUID = notificationUUID;
        this.passwordResetUUID = passwordResetUUID;
        this.registrationDate = registrationDate;
        this.secname=secname;
        this.userAgreement = userAgreement;
        this.personalDataAgree = personalDataAgree;
        this.phoneNumber= phoneNumber;
        this.idInMirIsmu = idInMirIsmu;
        this.userStudyGroupInMirIsmu = userStudyGroupInMirIsmu;



    }

    public String getUserStudyGroupInMirIsmu() {
        return userStudyGroupInMirIsmu;
    }

    public void setUserStudyGroupInMirIsmu(String userStudyGroupInMirIsmu) {
        this.userStudyGroupInMirIsmu = userStudyGroupInMirIsmu;
    }

    public Long getIdInMirIsmu() {
        return idInMirIsmu;
    }

    public void setIdInMirIsmu(Long idInMirIsmu) {
        this.idInMirIsmu = idInMirIsmu;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }



    public Set<Roles> getRoles() {
        return roles;
    }

    public void setRoles(Set<Roles> roles) {
        this.roles = roles;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
    public Integer getUserRole() {
        return userRole;
    }

    public void setUserRole(Integer userRole) {
        this.userRole = userRole;
    }

    public Long getUserGroup() {
        return userGroup;
    }

    public void setUserGroup(Long userGroup) {
        this.userGroup = userGroup;
    }
    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    public Long getWhoDeleted() {
        return whoDeleted;
    }

    public void setWhoDeleted(Long whoDeleted) {
        this.whoDeleted = whoDeleted;
    }

    public LocalDateTime getDeleteDate() {
        return deleteDate;
    }

    public void setDeleteDate(LocalDateTime deleteDate) {
        this.deleteDate = deleteDate;
    }

    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public LocalDateTime getLastPasswordResetRequestDate() {
        return lastPasswordResetRequestDate;
    }

    public void setLastPasswordResetRequestDate(LocalDateTime lastPasswordResetRequestDate) {
        this.lastPasswordResetRequestDate = lastPasswordResetRequestDate;
    }

    public Boolean getNotificationAgree() {
        return notificationAgree;
    }

    public void setNotificationAgree(Boolean notificationAgree) {
        this.notificationAgree = notificationAgree;
    }

    public String getNotificationUUID() {
        return notificationUUID;
    }

    public void setNotificationUUID(String notificationUUID) {
        this.notificationUUID = notificationUUID;
    }

    public String getPasswordResetUUID() {
        return passwordResetUUID;
    }

    public void setPassworResetdUUID(String passwordResetUUID) {
        this.passwordResetUUID = passwordResetUUID;
    }
    public String getSecname() {
        return secname;
    }

    public void setSecname(String secname) {
        this.secname = secname;
    }

    public Boolean getUserAgreement() {
        return userAgreement;
    }

    public void setUserAgreement(Boolean userAgreement) {
        this.userAgreement = userAgreement;
    }
}