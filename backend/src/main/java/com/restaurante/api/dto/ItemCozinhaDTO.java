package com.restaurante.api.dto;

import com.restaurante.api.enums.StatusItem;
import java.time.LocalDateTime;

public record ItemCozinhaDTO(
        Long id,
        Long pedidoId,
        Integer numeroMesa,
        String nomeProduto,
        Integer quantidade,
        String observacao,
        StatusItem status,
        LocalDateTime dataHora,
        String setor
) {}