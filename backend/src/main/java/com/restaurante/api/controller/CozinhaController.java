package com.restaurante.api.controller;

import com.restaurante.api.dto.ItemCozinhaDTO;
import com.restaurante.api.entity.ItemPedido;
import com.restaurante.api.entity.Setor;
import com.restaurante.api.enums.StatusItem;
import com.restaurante.api.repository.ItemPedidoRepository;
import com.restaurante.api.repository.SetorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/cozinha")
@CrossOrigin(origins = "*")
public class CozinhaController {

    private final ItemPedidoRepository itemRepository;
    private final SetorRepository setorRepository;

    public CozinhaController(ItemPedidoRepository itemRepository, SetorRepository setorRepository) {
        this.itemRepository = itemRepository;
        this.setorRepository = setorRepository;
    }

    @GetMapping("/setores")
    public List<String> listarSetoresAtivos() {
        return setorRepository.findAll().stream()
                .map(Setor::getNome)
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<ItemCozinhaDTO> listarPedidos() {
        List<StatusItem> statusVisiveis = Collections.singletonList(StatusItem.EM_PREPARO);
        List<ItemPedido> itens = itemRepository.findByStatusInOrderByDataHoraAsc(statusVisiveis);

        return itens.stream().map(item -> {
            Long loteId = Timestamp.valueOf(item.getDataHora()).getTime();

            return new ItemCozinhaDTO(
                    item.getId(),
                    loteId,
                    item.getMesa().getNumero(),
                    item.getProduto().getNome(),
                    item.getQuantidade(),
                    item.getObservacao(),
                    item.getStatus(),
                    item.getDataHora(),
                    item.getProduto().getCategoria().getSetor().getNome()
            );
        }).collect(Collectors.toList());
    }

    @PostMapping("/{id}/avancar")
    public ResponseEntity<Void> avancarStatus(@PathVariable Long id) {
        ItemPedido item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item não encontrado"));

        item.setStatus(StatusItem.CONCLUIDO);
        itemRepository.save(item);

        return ResponseEntity.ok().build();
    }
}