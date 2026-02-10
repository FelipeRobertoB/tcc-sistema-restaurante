package com.restaurante.api.dto;

import com.restaurante.api.enums.FormaPagamento;
import java.math.BigDecimal;

public record PagamentoItemDTO(
        FormaPagamento metodo,
        BigDecimal valor
) {}