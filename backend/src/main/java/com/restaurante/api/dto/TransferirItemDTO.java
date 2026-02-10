package com.restaurante.api.dto;

public record TransferirItemDTO(
        Long idItem,
        Long idMesaDestino
) {}