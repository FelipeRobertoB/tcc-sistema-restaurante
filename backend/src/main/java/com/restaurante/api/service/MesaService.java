package com.restaurante.api.service;

import com.restaurante.api.dto.ItemLoteDTO;
import com.restaurante.api.dto.TransferirMesaDTO;
import com.restaurante.api.entity.ItemPedido;
import com.restaurante.api.entity.Mesa;
import com.restaurante.api.entity.Produto;
import com.restaurante.api.enums.StatusItem;
import com.restaurante.api.enums.StatusMesa;
import com.restaurante.api.repository.ItemPedidoRepository;
import com.restaurante.api.repository.MesaRepository;
import com.restaurante.api.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MesaService {

    private final MesaRepository mesaRepository;
    private final ItemPedidoRepository itemPedidoRepository;
    private final ProdutoRepository produtoRepository;

    public MesaService(MesaRepository mesaRepository,
                       ItemPedidoRepository itemPedidoRepository,
                       ProdutoRepository produtoRepository) {
        this.mesaRepository = mesaRepository;
        this.itemPedidoRepository = itemPedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    public void abrirMesa(Long idMesa) {
        Mesa mesa = mesaRepository.findById(idMesa)
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));

        if (mesa.getStatus() != StatusMesa.LIVRE) {
            throw new RuntimeException("Esta mesa já está ocupada!");
        }

        mesa.setStatus(StatusMesa.ABERTA);
        mesa.setTotal(BigDecimal.ZERO);
        mesaRepository.save(mesa);
    }

    public void reabrirMesa(Long idMesa) {
        Mesa mesa = mesaRepository.findById(idMesa)
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));
        mesa.setStatus(StatusMesa.ABERTA);
        mesaRepository.save(mesa);
    }

    @Transactional
    public void cancelarAtendimento(Long idMesa) {
        Mesa mesa = mesaRepository.findById(idMesa)
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));

        var itens = itemPedidoRepository.findByMesaIdAndPagoFalse(idMesa);
        itemPedidoRepository.deleteAll(itens);

        mesa.setStatus(StatusMesa.LIVRE);
        mesa.setTotal(BigDecimal.ZERO);
        mesaRepository.save(mesa);
    }

    @Transactional
    public Mesa adicionarItensEmLote(Long mesaId, List<ItemLoteDTO> itensDto) {
        Mesa mesa = mesaRepository.findById(mesaId)
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));

        if (mesa.getStatus() == StatusMesa.LIVRE) {
            mesa.setStatus(StatusMesa.ABERTA);
        }

        LocalDateTime dataHoraLote = LocalDateTime.now();
        List<ItemPedido> novosItens = new ArrayList<>();
        BigDecimal totalDoLote = BigDecimal.ZERO;

        for (ItemLoteDTO dto : itensDto) {
            Produto produto = produtoRepository.findById(dto.produtoId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado ID: " + dto.produtoId()));

            BigDecimal valorTotalItem = produto.getPreco().multiply(new BigDecimal(dto.quantidade()));

            ItemPedido item = ItemPedido.builder()
                    .mesa(mesa)
                    .produto(produto)
                    .quantidade(dto.quantidade())
                    .precoUnitario(produto.getPreco())
                    .valorTotal(valorTotalItem)
                    .dataHora(dataHoraLote)
                    .observacao(dto.observacao())
                    .status(StatusItem.EM_PREPARO)
                    .pago(false)
                    .build();

            novosItens.add(item);
            totalDoLote = totalDoLote.add(valorTotalItem);
        }

        itemPedidoRepository.saveAll(novosItens);

        BigDecimal totalAtual = mesa.getTotal() == null ? BigDecimal.ZERO : mesa.getTotal();
        mesa.setTotal(totalAtual.add(totalDoLote));

        return mesaRepository.save(mesa);
    }

    @Transactional
    public void transferirMesa(TransferirMesaDTO dados) {
        if (dados.idMesaOrigem().equals(dados.idMesaDestino())) {
            throw new RuntimeException("A mesa de destino deve ser diferente da origem.");
        }

        Mesa origem = mesaRepository.findById(dados.idMesaOrigem())
                .orElseThrow(() -> new RuntimeException("Mesa de origem não encontrada"));

        Mesa destino = mesaRepository.findById(dados.idMesaDestino())
                .orElseThrow(() -> new RuntimeException("Mesa de destino não encontrada"));

        List<ItemPedido> itens = itemPedidoRepository.findByMesaIdAndPagoFalse(dados.idMesaOrigem());

        if (itens.isEmpty()) {
            throw new RuntimeException("A mesa de origem não tem itens para transferir");
        }

        BigDecimal totalOrigem = origem.getTotal() != null ? origem.getTotal() : BigDecimal.ZERO;
        BigDecimal totalDestino = destino.getTotal() != null ? destino.getTotal() : BigDecimal.ZERO;

        destino.setTotal(totalDestino.add(totalOrigem));
        origem.setTotal(BigDecimal.ZERO);

        for (ItemPedido item : itens) {
            item.setMesa(destino);
        }
        itemPedidoRepository.saveAll(itens);

        origem.setStatus(StatusMesa.LIVRE);
        mesaRepository.save(origem);

        if (destino.getStatus() == StatusMesa.LIVRE || destino.getStatus() == StatusMesa.FECHADA) {
            destino.setStatus(StatusMesa.ABERTA);
        }
        mesaRepository.save(destino);
    }
}