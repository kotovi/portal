package ru.geekbase.portal.domain;

import net.bytebuddy.dynamic.loading.InjectionClassLoader;

import javax.persistence.*;

@Entity
@Table(name="server")
public class Srv {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String serverName;
    private String serverDescription;
    private String serverUrl;
    private String serverSalt;
    private Integer serverDefault;

    public String getServerPanelUrl() {
        return serverPanelUrl;
    }

    public void setServerPanelUrl(String serverPanelUrl) {
        this.serverPanelUrl = serverPanelUrl;
    }

    private String serverPanelUrl;


    public Srv(){

    }

    public Srv(Long id, String serverName, String serverDescription, String serverUrl, String serverSalt, Integer serverDefault, String serverPanelUrl){
        this.id = id;
        this.serverName = serverName;
        this.serverDescription = serverDescription;
        this.serverUrl = serverUrl;
        this.serverSalt = serverSalt;
        this.serverDefault = serverDefault;
        this.serverPanelUrl = serverPanelUrl;
    }



    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public String getServerDescription() {
        return serverDescription;
    }

    public void setServerDescription(String serverDescription) {
        this.serverDescription = serverDescription;
    }

    public String getServerUrl() {
        return serverUrl;
    }

    public void setServerUrl(String serverUrl) {
        this.serverUrl = serverUrl;
    }

    public String getServerSalt() {
        return serverSalt;
    }

    public void setServerSalt(String serverSalt) {
        this.serverSalt = serverSalt;
    }
    public Integer getServerDefault() {
        return serverDefault;
    }

    public void setServerDefault(Integer serverDefault) {
        this.serverDefault = serverDefault;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }




}
