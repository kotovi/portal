package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.Test;

import java.util.List;
import java.util.Optional;

public interface LectionTestingRepo extends JpaRepository<Test, Long> {
    List<Test> findByLectionIdAndCreatorId(Long lectionId, Long creatorId);



    List<Test> findByCreatorId(Long creatorId);
    Optional<Test> findByIdAndCreatorId(Long testId, Long creatorId);

    Optional<Test> findByLectionIdAndDefaultTest(Long LectionId, Integer DefaultTest);
    Optional<Test> findById(Long Id);

    List<Test> findByCourceIdAndCreatorIdAndTestType(Long courceId, Long creatorId, Integer testType);
    Optional<Test> findByCourceIdAndDefaultTestAndTestType(Long CourceId, Integer DefaultTest, Integer TestType);


    List<Test> findByLectionId(Long valueOf);
}
