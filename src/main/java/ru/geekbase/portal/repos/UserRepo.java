package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.Roles;
import ru.geekbase.portal.domain.User;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static ru.geekbase.portal.domain.Roles.STUDENT;

public interface UserRepo  extends JpaRepository<User, Long> {
    User findByUsername(String username);
    Optional<User> findAllById(Long id);
    Optional<User> findByIdInMirIsmu(Long idInMirIsmu);
    Optional<User> findById(Long id);
    List<User> findByUserGroup(Long userGroup);
    Optional<User> findByUserEmail(String userEmail);
    Optional<User> findByNotificationUUID(String NotificationUUID);
    Optional<User> findByPasswordResetUUID(String PasswordResetUUID);
    List<User> findAllByRolesNotIn(Set<Roles> Roles);
    List<User> findAllByRolesIn(Set<Roles> Roles);
    List<User> findAllByRolesIsNotContaining(Roles Roles);

}
