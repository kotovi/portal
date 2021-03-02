package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.Lection;
import ru.geekbase.portal.domain.Srv;

import java.util.List;
import java.util.Optional;

public interface ServerRepo extends JpaRepository<Srv,Long> {
    List<Srv> findAllById(Long id);
    Optional<Srv> findById(Long id);
    Optional<Srv> findByServerDefault(Integer serverDefault);

}
