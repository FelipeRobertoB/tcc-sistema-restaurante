package com.restaurante.api.dto;

public record AdicionarItemDTO(
        Long idMesa,
        String codigoProduto,
        Integer quantidade
) {}