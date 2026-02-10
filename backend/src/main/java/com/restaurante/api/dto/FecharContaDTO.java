package com.restaurante.api.dto;

import java.math.BigDecimal;
import java.util.List;

public record FecharContaDTO(
        Long idMesa,
        BigDecimal totalFinal,
        boolean taxaServicoCobrada,
        BigDecimal desconto,
        List<PagamentoItemDTO> listaPagamentos
) {}