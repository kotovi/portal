package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.Seminar;

import java.util.List;
import java.util.Optional;

public interface SeminarRepo extends JpaRepository<Seminar, Long> {

    Optional<Seminar> findByCreatorIdAndId(Long creatorId, Long id);
    Optional<Seminar> findById(Long id);
    List<Seminar>  findAllByMeetingStatus(Integer MeetingStatus);
    Optional<List<Seminar>>  findByMeetingStatusAndMeetingIdIsNotNull(Integer MeetingStatus);
    List<Seminar> findAllByCreatorId(Long CreatorId);
    Optional<List<Seminar>> findAllByMeetingStatusAndMeetingRecordUrlIsNull(Integer MeetingStatus);
    List<Seminar> findAllByCreatorIdOrderBySeminarCreateDateAsc(Long CreatorId);

    List<Seminar> findAllByCreatorIdOrderByIdDesc(Long CreatorId);
 }
