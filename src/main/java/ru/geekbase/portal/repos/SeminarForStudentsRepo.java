package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.SeminarForStudents;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SeminarForStudentsRepo extends JpaRepository<SeminarForStudents, Long> {
   Optional<List<SeminarForStudents>> findAllBySeminarId(Long SeminarId);
   List<SeminarForStudents> findAllByUserGroupId(Long UserGroupId);

   List<SeminarForStudents> findAllByUserGroupIdOrderBySeminarIdDesc(Long UserGroupId);
   List<SeminarForStudents> findAllByUserGroupIdAndCreateDateAfterOrderBySeminarIdDesc(Long UserGroupId, LocalDateTime CreateDate);
   void deleteAllBySeminarId(Long SeminarId);

}
