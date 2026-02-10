package com.restaurante.api.service;

import com.restaurante.api.dto.ContaDTO;
import com.restaurante.api.dto.DetalhePedidoDTO;
import com.restaurante.api.dto.FecharContaDTO;
import com.restaurante.api.dto.PagamentoItemDTO;
import com.restaurante.api.entity.ItemPedido;
import com.restaurante.api.entity.Mesa;
import com.restaurante.api.entity.Pagamento;
import com.restaurante.api.entity.Venda;
import com.restaurante.api.enums.StatusMesa;
import com.restaurante.api.repository.ItemPedidoRepository;
import com.restaurante.api.repository.MesaRepository;
import com.restaurante.api.repository.PagamentoRepository;
import com.restaurante.api.repository.VendaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagamentoService {

    private final MesaRepository mesaRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final VendaRepository vendaRepository;
    private final PagamentoRepository pagamentoRepository;

    public PagamentoService(MesaRepository mesaRepository,
                            ItemPedidoRepository itemPedidoRepository,
                            VendaRepository vendaRepository,
                            PagamentoRepository pagamentoRepository) {
        this.mesaRepository = mesaRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.vendaRepository = vendaRepository;
        this.pagamentoRepository = pagamentoRepository;
    }

    @Transactional
    public ContaDTO solicitarConta(Long idMesa) {
        Mesa mesa = mesaRepository.findById(idMesa)
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));

        if (mesa.getStatus() != StatusMesa.FECHADA) {
            mesa.setStatus(StatusMesa.FECHADA);
            mesaRepository.save(mesa);
        }

        List<ItemPedido> itens = itemPedidoRepository.findByMesaIdAndPagoFalse(idMesa);

        List<DetalhePedidoDTO> itensDTO = itens.stream()
                .map(ItemPedido::toDetalheDTO)
                .collect(Collectors.toList());

        BigDecimal subtotal = itens.stream()
                .map(ItemPedido::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal valorTaxa = subtotal.multiply(new BigDecimal("0.10"))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalFinal = subtotal.add(valorTaxa);

        return new ContaDTO(
                mesa.getId(),
                itensDTO,
                subtotal,
                valorTaxa,
                totalFinal
        );
    }

    @Transactional
    public void fecharConta(FecharContaDTO dto) {
        Mesa mesa = mesaRepository.findById(dto.idMesa())
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));

        List<ItemPedido> itens = itemPedidoRepository.findByMesaIdAndPagoFalse(dto.idMesa());

        BigDecimal subtotal = itens.stream()
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

        Venda venda = Venda.builder()
                .idMesaOrigem(mesa.getId())
                .dataHora(LocalDateTime.now())
                .subtotal(subtotal)
                .taxaServico(taxaServico)
                .valorTotal(valorTotalBruto)
                .desconto(desconto)
                .valorFinal(valorFinalLiquido)
                .build();

        vendaRepository.save(venda);

        BigDecimal saldoRestanteParaCobrir = valorFinalLiquido;

        for (PagamentoItemDTO pDto : dto.listaPagamentos()) {
            if (saldoRestanteParaCobrir.compareTo(BigDecimal.ZERO) <= 0) {
                break;
            }

            Pagamento pag = new Pagamento();
            pag.setVenda(venda);
            pag.setFormaPagamento(pDto.metodo());

            BigDecimal valorRecebido = pDto.valor();

            BigDecimal valorParaSalvar;

            if (valorRecebido.compareTo(saldoRestanteParaCobrir) > 0) {
                valorParaSalvar = saldoRestanteParaCobrir;
            } else {
                valorParaSalvar = valorRecebido;
            }

            pag.setValor(valorParaSalvar);
            pagamentoRepository.save(pag);

            saldoRestanteParaCobrir = saldoRestanteParaCobrir.subtract(valorParaSalvar);
        }

        for (ItemPedido item : itens) {
            item.setPago(true);
            item.setVenda(venda);
            itemPedidoRepository.save(item);
        }

        mesa.setStatus(StatusMesa.LIVRE);
        mesa.setTotal(BigDecimal.ZERO);
        mesaRepository.save(mesa);
    }
}