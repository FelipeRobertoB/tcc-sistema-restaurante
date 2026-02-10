package com.restaurante.api.service;

import com.restaurante.api.dto.FecharContaDTO;
import com.restaurante.api.dto.PagamentoItemDTO;
import com.restaurante.api.dto.VendaResponseDTO;
import com.restaurante.api.entity.ItemPedido;
import com.restaurante.api.entity.Mesa;
import com.restaurante.api.entity.Pagamento;
import com.restaurante.api.entity.Venda;
import com.restaurante.api.enums.StatusMesa;
import com.restaurante.api.repository.ItemPedidoRepository;
import com.restaurante.api.repository.MesaRepository;
import com.restaurante.api.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepository;
    private final MesaRepository mesaRepository;
    private final ItemPedidoRepository itemPedidoRepository;

    @Transactional
    public Venda fecharConta(FecharContaDTO dto) {

        Mesa mesa = mesaRepository.findById(dto.idMesa())
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));

        List<ItemPedido> itensPendentes = itemPedidoRepository.findByMesaAndPagoFalse(mesa); 

        if (itensPendentes.isEmpty()) {
            throw new RuntimeException("Não há itens pendentes para esta mesa.");
        }

        BigDecimal subtotal = itensPendentes.stream()
                .map(ItemPedido::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal taxaServico = BigDecimal.ZERO;
        if (dto.taxaServicoCobrada()) {
            taxaServico = subtotal.multiply(new BigDecimal("0.10"))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal valorTotalBruto = subtotal.add(taxaServico);

        BigDecimal desconto = dto.desconto() != null ? dto.desconto() : BigDecimal.ZERO;

        BigDecimal valorFinalLiquido = valorTotalBruto.subtract(desconto);
        if (valorFinalLiquido.compareTo(BigDecimal.ZERO) < 0) {
            valorFinalLiquido = BigDecimal.ZERO;
        }

        Venda novaVenda = Venda.builder()
                .dataHora(LocalDateTime.now())
                .idMesaOrigem(mesa.getId())
                .subtotal(subtotal)
                .taxaServico(taxaServico)
                .valorTotal(valorTotalBruto)
                .desconto(desconto)
                .valorFinal(valorFinalLiquido)
                .pagamentos(new ArrayList<>())
                .build();

        Venda vendaSalva = vendaRepository.save(novaVenda);

        if (dto.listaPagamentos() != null) {

            BigDecimal saldoParaRegistrar = valorFinalLiquido;

            for (PagamentoItemDTO pDto : dto.listaPagamentos()) {

                if (saldoParaRegistrar.compareTo(BigDecimal.ZERO) <= 0) {
                    break;
                }

                BigDecimal valorRecebido = pDto.valor();
                BigDecimal valorParaSalvar;

                if (valorRecebido.compareTo(saldoParaRegistrar) > 0) {
                    valorParaSalvar = saldoParaRegistrar;
                } else {
                    valorParaSalvar = valorRecebido;
                }

                Pagamento pagamento = Pagamento.builder()
                        .venda(vendaSalva)
                        .formaPagamento(pDto.metodo())
                        .valor(valorParaSalvar)
                        .build();

                vendaSalva.getPagamentos().add(pagamento);

                saldoParaRegistrar = saldoParaRegistrar.subtract(valorParaSalvar);
            }
            vendaRepository.save(vendaSalva);
        }

        for (ItemPedido item : itensPendentes) {
            item.setVenda(vendaSalva);
            item.setPago(true);
        }
        itemPedidoRepository.saveAll(itensPendentes);

        mesa.setStatus(StatusMesa.LIVRE);
        mesa.setTotal(BigDecimal.ZERO);
        mesaRepository.save(mesa);

        return vendaSalva;
    }

    public List<VendaResponseDTO> listarVendas(String inicioStr, String fimStr) {
        LocalDateTime inicio, fim;

        if (inicioStr == null || inicioStr.isEmpty()) {
            inicio = LocalDate.now().atStartOfDay();
            fim = LocalDate.now().atTime(LocalTime.MAX);
        } else {
            inicio = LocalDate.parse(inicioStr).atStartOfDay();
            fim = (fimStr != null && !fimStr.isEmpty())
                    ? LocalDate.parse(fimStr).atTime(LocalTime.MAX)
                    : LocalDate.parse(inicioStr).atTime(LocalTime.MAX);
        }

        return vendaRepository.findByDataHoraBetween(inicio, fim).stream()
                .sorted((v1, v2) -> v2.getDataHora().compareTo(v1.getDataHora()))
                .map(VendaResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}