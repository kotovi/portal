package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.Notification;
import java.util.List;
import java.util.Optional;


public interface NotificationRepo extends JpaRepository<Notification, Long> {
    List<Notification> findByNotificationStatus(Integer notificationStatus);
    Optional<Notification> findByNotificationStatusAndSourceId(Integer notificationStatus, Long sourceId);
    Optional<Notification> findBySourceId(Long sourceId);
    void deleteBySourceId(Long sourceId);

}
