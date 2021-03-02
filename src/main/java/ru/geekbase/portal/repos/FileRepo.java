package ru.geekbase.portal.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.geekbase.portal.domain.File;

import java.util.List;
import java.util.Optional;


public interface FileRepo extends JpaRepository<File,Long> {

    Optional<List<File>> findAllByLectionId(Long lectionId);
    void  deleteFileById(Long id);

}
