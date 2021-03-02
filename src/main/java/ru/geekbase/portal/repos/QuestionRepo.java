package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.Question;

import java.util.List;
import java.util.Optional;

public interface QuestionRepo extends JpaRepository<Question,Long> {
    List<Question> findByCreatorIdAndTestId(Long creatorId, Long testId);
    Optional<Question> findAllById(Long id);
    List<Question> findAllByTestId(Long TestId);
    Optional<Question> findById(Long id);

    Optional<List<Question>> findAllByEnQuestionBodyIsNull();
}