package com.example.backend.service;

import com.example.backend.entity.Task;
import com.example.backend.repository.TaskRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "tasks")
    public Page<Task> getAllTasks(Pageable pageable) {
        return taskRepository.findAllWithComments(pageable);
    }

    @Transactional
    @CacheEvict(value = "tasks", allEntries = true)
    public Task addTask(Task task) {
        if (task.getTitle() == null || task.getTitle().isBlank()) {
            throw new IllegalArgumentException("Task title cannot be empty");
        }
        task.setCompleted(false);
        return taskRepository.save(task);
    }

    @Transactional
    @CacheEvict(value = "tasks", allEntries = true)
    public Task toggleTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found: " + id));
        task.setCompleted(!task.isCompleted());
        return taskRepository.save(task);
    }

    @Transactional
    @CacheEvict(value = "tasks", allEntries = true)
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new IllegalArgumentException("Task not found: " + id);
        }
        taskRepository.deleteById(id);
    }
}
