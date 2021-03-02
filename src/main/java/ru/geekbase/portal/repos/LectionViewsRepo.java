package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.LectionViews;

import java.util.List;

public interface LectionViewsRepo extends JpaRepository<LectionViews, Long> {
    List<LectionViews> findByLectionIdOrderByAddTime(Long LectionId);
}
