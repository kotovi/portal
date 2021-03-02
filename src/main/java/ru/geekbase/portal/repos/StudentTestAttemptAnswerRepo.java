package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.StudentTestAttemptAnswer;

public interface StudentTestAttemptAnswerRepo extends JpaRepository<StudentTestAttemptAnswer, Long> {
}
