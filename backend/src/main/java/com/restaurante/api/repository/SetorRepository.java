package com.restaurante.api.repository;

import com.restaurante.api.entity.Setor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SetorRepository extends JpaRepository<Setor, Long> {
    Optional<Setor> findByNomeIgnoreCase(String nome);
}