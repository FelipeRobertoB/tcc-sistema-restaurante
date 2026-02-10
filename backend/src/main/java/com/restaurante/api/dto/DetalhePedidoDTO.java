package com.restaurante.api.dto;

import com.restaurante.api.enums.StatusItem;
import java.math.BigDecimal;
import java.time.LocalTime;

public record DetalhePedidoDTO(
        Long idItem,
        String nomeProduto,
        Integer quantidade,
        BigDecimal preco,
        BigDecimal total,
        LocalTime hora,
        String observacao,
        StatusItem status
) {}