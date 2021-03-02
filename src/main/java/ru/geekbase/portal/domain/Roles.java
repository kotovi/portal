package ru.geekbase.portal.domain;

import org.springframework.security.core.GrantedAuthority;

public enum Roles implements GrantedAuthority {
    USER, ADMIN, STUDENT,LECTOR,MODERATOR,SERVERADMIN;

    @Override
    public String getAuthority(){
        return name();
    }
}
