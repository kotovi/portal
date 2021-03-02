package ru.geekbase.portal.domain;

public final class UserView {
    public interface ForNb {}
    public  interface ForUserList extends ForNb{}
    public interface FullUserList extends ForUserList{}
}
