package ru.geekbase.portal.domain;

public class QuestionView {
    public interface ForStudent{}
    public interface ForLector extends  ForStudent{}
    public interface FullMessage extends ForLector {}
}
