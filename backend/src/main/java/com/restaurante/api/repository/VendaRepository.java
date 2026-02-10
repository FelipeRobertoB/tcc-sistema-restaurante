package com.restaurante.api.repository;

import com.restaurante.api.entity.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {

    List<Venda> findByDataHoraBetween(LocalDateTime inicio, LocalDateTime fim);
}