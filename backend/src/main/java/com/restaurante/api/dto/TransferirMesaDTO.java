package com.restaurante.api.dto;

public record TransferirMesaDTO(
        Long idMesaOrigem,
        Long idMesaDestino
) {}