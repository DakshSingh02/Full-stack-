package com.example.backend.repository;

import com.example.backend.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.comments ORDER BY t.id DESC")
    Page<Task> findAllWithComments(Pageable pageable);

    @Query("SELECT DISTINCT t FROM Task t LEFT JOIN FETCH t.comments WHERE t.id = :id")
    Optional<Task> findByIdWithComments(@Param("id") Long id);

    @Query(value = "SELECT * FROM tasks ORDER BY id DESC LIMIT 5", nativeQuery = true)
    List<Task> findLatestTasksNative();
}
