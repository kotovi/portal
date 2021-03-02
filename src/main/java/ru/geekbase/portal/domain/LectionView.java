package ru.geekbase.portal.domain;

public final class LectionView {
    public interface MinimalList{}
    public interface ForFront extends MinimalList{}
    public interface ForLectionList extends  ForFront{}
    public interface FullMessage extends ForLectionList {}
    }

