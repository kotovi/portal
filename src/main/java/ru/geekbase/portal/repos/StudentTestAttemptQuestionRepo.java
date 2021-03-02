package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.StudentTestAttemptQuestion;

import java.util.List;

public interface StudentTestAttemptQuestionRepo extends JpaRepository<StudentTestAttemptQuestion, Long> {
    List<StudentTestAttemptQuestion> findAllByStudentTestAttemptId(Long StudentTestAttemptId);

}
