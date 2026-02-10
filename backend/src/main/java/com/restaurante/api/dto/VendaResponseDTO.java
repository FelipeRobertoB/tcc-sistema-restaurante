package com.restaurante.api.dto;

import com.restaurante.api.entity.Venda;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

public record VendaResponseDTO(
        Long id,
        Long idMesaOrigem,
        String dataHora,
        BigDecimal total,
        BigDecimal desconto,
        BigDecimal valorFinal,
        BigDecimal taxaServico,
        List<String> pagamentos
) {
    public static VendaResponseDTO fromEntity(Venda venda) {
        String dataFormatada = null;
        if (venda.getDataHora() != null) {
            dataFormatada = venda.getDataHora().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        }

        List<String> descricoesPagamento = null;
        if (venda.getPagamentos() != null) {
            descricoesPagamento = venda.getPagamentos().stream()
                    .map(p -> p.getFormaPagamento() + ": R$ " + p.getValor())
                    .collect(Collectors.toList());
        }

        return new VendaResponseDTO(
                venda.getId(),
                venda.getIdMesaOrigem(),
                dataFormatada,
                venda.getValorTotal(),
                venda.getDesconto(),
                venda.getValorFinal(),
                venda.getTaxaServico(),
                descricoesPagamento
        );
    }
}