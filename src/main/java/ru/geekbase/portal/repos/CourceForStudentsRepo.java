package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.CourceForStudents;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface CourceForStudentsRepo extends JpaRepository<CourceForStudents, Long> {
    Optional<CourceForStudents> findById(Long Id);
    List<CourceForStudents> findAllByAccessEndDateIsNull();
    Optional<CourceForStudents> findByIdAndAccessEndDateIsNotNull(Long Id);
    List<CourceForStudents> findAllByUserGroupIdAndAccessEndDateIsNull(Long UserGroupId);
    List<CourceForStudents> findAllByUserGroupId(Long UserGroupId);
    List<CourceForStudents> findAllByCourceIdAndAccessEndDateIsNull(Long CourceID);
    List<CourceForStudents> findAllByCourceId(Long CourceID);

    //List<CourceForStudents> findAllByUserGroupIdAndAccessBeginDateAfterAndAccessEndDateBefore(Long UserGroupId, Date AccessBeginDate,Date AccessEndDate );
    List<CourceForStudents> findAllByUserGroupIdAndAccessEndDateBefore(Long UserGroupId,LocalDateTime AccessEndDate );

 }
