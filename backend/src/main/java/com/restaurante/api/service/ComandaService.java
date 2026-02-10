package com.restaurante.api.service;

import com.restaurante.api.dto.AdicionarItemDTO;
import com.restaurante.api.dto.DetalhePedidoDTO;
import com.restaurante.api.dto.TransferirItemDTO;
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
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComandaService {

    private final ItemPedidoRepository itemPedidoRepository;
    private final MesaRepository mesaRepository;
    private final ProdutoRepository produtoRepository;

    public ComandaService(ItemPedidoRepository itemPedidoRepository, MesaRepository mesaRepository, ProdutoRepository produtoRepository) {
        this.itemPedidoRepository = itemPedidoRepository;
        this.mesaRepository = mesaRepository;
        this.produtoRepository = produtoRepository;
    }

    @Transactional
    public ItemPedido adicionarItem(AdicionarItemDTO dados) {
        // Record: dados.idMesa()
        Mesa mesa = mesaRepository.findById(dados.idMesa())
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));

        if (mesa.getStatus() == StatusMesa.FECHADA) {
            throw new RuntimeException("Mesa em pagamento. Reabra para adicionar itens.");
        }
        if (mesa.getStatus() == StatusMesa.LIVRE) {
            mesa.setStatus(StatusMesa.ABERTA);
            mesaRepository.save(mesa);
        }

        Produto produto = produtoRepository.findByCodigo(dados.codigoProduto())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        BigDecimal valorTotal = produto.getPreco().multiply(new BigDecimal(dados.quantidade()));

        ItemPedido novoItem = ItemPedido.builder()
                .mesa(mesa)
                .produto(produto)
                .quantidade(dados.quantidade())
                .precoUnitario(produto.getPreco())
                .valorTotal(valorTotal)
                .dataHora(LocalDateTime.now())
                .status(StatusItem.EM_PREPARO)
                .pago(false)
                .build();

        BigDecimal totalAtual = mesa.getTotal() == null ? BigDecimal.ZERO : mesa.getTotal();
        mesa.setTotal(totalAtual.add(valorTotal));
        mesaRepository.save(mesa);

        return itemPedidoRepository.save(novoItem);
    }

    public List<DetalhePedidoDTO> listarItens(Long idMesa) {
        if (!mesaRepository.existsById(idMesa)) throw new RuntimeException("Mesa não encontrada");

        return itemPedidoRepository.findByMesaIdAndPagoFalse(idMesa).stream()
                .map(ItemPedido::toDetalheDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelarItem(Long idItem) {
        ItemPedido item = itemPedidoRepository.findById(idItem)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        if (Boolean.TRUE.equals(item.getPago())) {
            throw new RuntimeException("Item já pago não pode ser cancelado.");
        }

        Mesa mesa = item.getMesa();
        mesa.setTotal(mesa.getTotal().subtract(item.getValorTotal()));
        mesaRepository.save(mesa);

        itemPedidoRepository.delete(item);
    }

    @Transactional
    public void transferirItem(TransferirItemDTO dados) {
        ItemPedido item = itemPedidoRepository.findById(dados.idItem())
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        Mesa mesaDestino = mesaRepository.findById(dados.idMesaDestino())
                .orElseThrow(() -> new RuntimeException("Mesa destino não encontrada"));

        if (mesaDestino.getStatus() == StatusMesa.FECHADA) {
            throw new RuntimeException("Mesa destino fechada.");
        }

        Mesa mesaOrigem = item.getMesa();
        mesaOrigem.setTotal(mesaOrigem.getTotal().subtract(item.getValorTotal()));

        BigDecimal totalDestino = mesaDestino.getTotal() == null ? BigDecimal.ZERO : mesaDestino.getTotal();
        mesaDestino.setTotal(totalDestino.add(item.getValorTotal()));

        if (mesaDestino.getStatus() == StatusMesa.LIVRE) {
            mesaDestino.setStatus(StatusMesa.ABERTA);
        }

        item.setMesa(mesaDestino);

        itemPedidoRepository.save(item);
        mesaRepository.save(mesaOrigem);
        mesaRepository.save(mesaDestino);
    }

}