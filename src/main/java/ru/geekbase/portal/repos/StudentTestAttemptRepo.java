package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.StudentTestAttempt;

import java.util.List;
import java.util.Optional;

public interface StudentTestAttemptRepo extends JpaRepository<StudentTestAttempt, Long> {
    Optional<StudentTestAttempt> findByStudentIdAndLectionIdAndEndDateIsNull(Long StudentId, Long LectionId);
    Optional<StudentTestAttempt> findByStudentIdAndLectionIdAndUserFinalBallConfirmDateIsNull(Long StudentId, Long LectionId);
    Optional<StudentTestAttempt> findByStudentIdAndLectionIdAndUserFinalBallConfirmDateIsNotNullAndUserFinalBallConfirmIsNull(Long StudentId, Long LectionId);

    Optional<StudentTestAttempt> findByStudentIdAndLectionIdAndUserFinalBallConfirmDateIsNotNull(Long StudentId, Long LectionId);
  
    Optional<StudentTestAttempt> findByStudentIdAndLectionIdAndUserFinalBallConfirmDateIsNullAndEndDateIsNotNull(Long StudentId, Long LectionId);



    List<StudentTestAttempt> findByStudentIdAndLectionIdAndUserFinalBallConfirmIsTrueOrderByFinalBallDesc(Long StudentId, Long LectionId);

    List<StudentTestAttempt> findByStudentIdAndCourceIdAndTestTypeAndUserFinalBallConfirmIsTrueOrderByFinalBallDesc(Long StudentId, Long CourceId, Integer TestType);

    Optional<StudentTestAttempt> findByStudentIdAndCourceIdAndTestTypeAndUserFinalBallConfirmDateIsNull(Long StudentId, Long CourceId, Integer TestType);
    List<StudentTestAttempt> findByLectionIdAndUserFinalBallConfirmIsTrueOrderByStudentId(Long LectionId);
    List<StudentTestAttempt> findByLectionIdOrderByStudentId(Long LectionId);

    Optional<StudentTestAttempt> findByStudentIdAndLectionIdAndEndDateIsNullAndTestType(Long StudentId, Long LectionId, Integer TestType);
}
