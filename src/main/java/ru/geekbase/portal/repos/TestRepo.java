package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.Test;

import java.util.List;
import java.util.Optional;

//public interface LectionTestingRepo extends JpaRepository<Test, Long> {
public interface TestRepo extends JpaRepository<Test, Long> {
    Optional<List<Test>> findAllByUserGroupId(Long userGroupId);
    Optional<Test> findById(Long id);

    Optional<List<Test>> findAllByTestTypeAndUserGroupId(Integer testType, Long userGroupId);
}
