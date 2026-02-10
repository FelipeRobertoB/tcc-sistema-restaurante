package com.restaurante.api.repository;

import com.restaurante.api.entity.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {

    List<Mesa> findByAtivoTrueOrderByNumeroAsc();

    Optional<Mesa> findByNumero(Integer numero);

}