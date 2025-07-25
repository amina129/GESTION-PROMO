package com.codewithamina.gestionpromo.repository;

import com.codewithamina.gestionpromo.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByCodeIn(List<String> codes);
}
