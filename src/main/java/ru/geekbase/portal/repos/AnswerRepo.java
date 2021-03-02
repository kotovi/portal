package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.Answer;

import java.util.List;
import java.util.Optional;

public interface AnswerRepo extends JpaRepository<Answer,Long> {

    Optional<List<Answer>> findAllByQuestionId(Long questionId);
    Optional<Answer> findAllById(Long Id);



    Optional<List<Answer>> findAllByEnAnswerBodyIsNull();
}
