package com.restaurante.api.dto;

public record ItemLoteDTO(
        Long produtoId,
        Integer quantidade,
        String observacao
) {}