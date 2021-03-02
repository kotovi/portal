package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.UserGroup;

import java.util.List;
import java.util.Optional;

public interface UserGroupRepo extends JpaRepository<UserGroup, Long> {
    List<UserGroup> findAll();
    Optional<UserGroup> findById(Long id);
    Optional<List<UserGroup>> findAllByGroupType(Integer GroupType);
    Optional<UserGroup> findByNidInIsmu(Long NidInIsmu);

}
