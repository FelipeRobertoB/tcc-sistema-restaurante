package com.restaurante.api.dto;

import java.math.BigDecimal;
import java.util.List;

public record ContaDTO(
        Long idMesa,
        List<DetalhePedidoDTO> itens,
        BigDecimal subtotal,
        BigDecimal valorTaxa,
        BigDecimal totalFinal
) {}