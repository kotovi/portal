package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.SeminarListener;

import java.util.List;
import java.util.Optional;

public interface SeminarListenerRepo extends JpaRepository<SeminarListener, Long> {
    List<SeminarListener> findAllByCreatorId(Long CreatorId);
    Optional<SeminarListener> findAllById(Long Id);
    List<SeminarListener> findAllBySeminarId(Long SeminarId);
    List<SeminarListener> findAllByListenerId(Long ListenerId);
    List<SeminarListener> findAllByListenerIdOrderBySeminarIdDesc(Long ListenerId);
    void deleteAllBySeminarId(Long SeminarId);
}
