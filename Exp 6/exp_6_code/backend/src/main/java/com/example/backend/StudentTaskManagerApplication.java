package com.example.backend;

import com.example.backend.entity.Task;
import com.example.backend.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
@EnableCaching
public class StudentTaskManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentTaskManagerApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(TaskRepository taskRepository) {
        return args -> {
            if (taskRepository.count() == 0) {
                taskRepository.save(new Task("Prepare Java notes", false));
                taskRepository.save(new Task("Review experiment 6", true));
                taskRepository.save(new Task("Submit assignment", false));
                taskRepository.save(new Task("Practice H2 queries", false));
                taskRepository.save(new Task("Read caching notes", true));
            }
        };
    }
}
