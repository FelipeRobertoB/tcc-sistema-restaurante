package com.restaurante.api.repository;

import com.restaurante.api.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    Optional<Produto> findByCodigo(String codigo);

    List<Produto> findByCategoriaId(Long idCategoria);

    @Query("SELECT p FROM Produto p WHERE LOWER(p.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR p.codigo = :termo")
    List<Produto> buscarPorNomeOuCodigo(@Param("termo") String termo);

    @Query(value = "SELECT MAX(CAST(codigo AS BIGINT)) FROM tb_produto WHERE codigo REGEXP '^[0-9]+$'", nativeQuery = true)
    Long findMaxCodigo();
}