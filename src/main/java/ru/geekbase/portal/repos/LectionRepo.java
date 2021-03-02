package ru.geekbase.portal.repos;

import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.geekbase.portal.domain.Lection;
import ru.geekbase.portal.domain.User;

import java.util.List;
import java.util.Optional;

public interface LectionRepo extends JpaRepository<Lection, Long> {

    List<Lection> findByCourceIdAndDeletedAndAuthorIdInOrderByLectionPosition(Long courceId, Boolean deleted, List<Long> authorIdList);

    Optional<Lection> findById(Long id);
    Optional<Lection> findByAuthorIdAndId(Long authorId, Long id);
    List<Lection> findByCourceIdAndAuthorIdAndDeletedOrderByLectionPosition(Long courceId, Long authorId, Boolean deleted);
    List<Lection> findByMeetingStatus(Integer meetingStatus);
    List<Lection> findByMeetingStatusAndRecordStatus(Integer meetingStatus, Integer recordStatus);
    List<Lection> findByCourceId(Long courceId);
    List<Lection> findByCourceIdAndDeletedIsFalse(Long courceId);
    List<Lection> findByCourceIdOrderByLectionPositionAsc(Long courceId);
    List<Lection> findByCourceIdAndDeletedIsFalseOrderByLectionPositionAsc(Long courceId);
    List<Lection> findByCourceIdAndLectionUrlIsNotNullOrderByLectionPositionAsc(Long courceId);

    List<Lection> findAllByUserGroup(Long userGroup);
    List<Lection> findAllById(Long id);
    List<Lection> findByCourceIdAndDeletedIsNull(Long courceId);
    List<Lection> findByCourceIdAndDeletedIsNullAndLectionUrlIsNotNullOrderByLectionPositionAsc(Long courceId);

    List<Lection> findByCourceIdAndDeletedOrderByLectionPositionAsc(Long courceId, Integer Deleted);
    List<Lection> findByCourceIdAndDeletedAndAccessBeginDateIsNotNullOrderByLectionPositionAsc(Long courceId, Boolean Deleted);

    List<Lection> findByCourceIdAndDeletedOrderByLectionPositionAsc(Long courceId, Boolean Deleted);

    List<Lection> findByCourceIdAndDeleteDateIsNullOrderByLectionPositionAsc(Long courceId);



    List<Lection> findByCourceIdAndLectionUrlIsNotNullAndAndDeletedIsFalseOrderByLectionPositionAsc(Long courceId);
    Optional<List<Lection>> findAllByEnLectionNameIsNullAndDeletedIsFalse();
    Optional<List<Lection>> findAllByMeetingStatus(Integer meetingStatus);




}


