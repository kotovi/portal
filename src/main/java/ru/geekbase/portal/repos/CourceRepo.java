package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.Cource;

import java.util.List;
import java.util.Optional;

public interface CourceRepo extends JpaRepository<Cource, Long> {
    List<Cource> findByUserGroup(Long userGroup);
    List<Cource> findAllByIsDeleted(Boolean IsDeleted);
    List<Cource> findAllByCreatorId(Long creatorId);
    Optional<Cource> findAllById(Long id);
    Optional<Cource> findById(Long id);
    List<Cource> findByCreatorIdOrUserGroup(Long creatorId, Long userGroup);
    List<Cource> findByCreatorIdOrUserGroupAndIsDeleted(Long creatorId, Long userGroup, Boolean isDeleted);
    List<Cource> findAllByCreatorIdAndIsDeleted(Long creatorId, Boolean isDeleted);
    List<Cource> findByCreatorIdAndIsDeleted(Long creatorId, Boolean isDeleted);
    List<Cource> findByUserGroupAndIsDeleted(Long userGroup, Boolean isDeleted);
    List<Cource> findByIsDeletedAndCreatorIdIn(Boolean isDeleted, List<Long> creatorIdList);

    List<Cource> findAllByUserGroupAndDeleteDateIsNull(Long UserGroup);


    Optional<List<Cource>> findAllByEnCourceNameIsNullAndDeleteDateIsNull();

}
