package com.restaurante.api.controller;

import com.restaurante.api.dto.AdicionarItemDTO;
import com.restaurante.api.dto.DetalhePedidoDTO;
import com.restaurante.api.dto.TransferirItemDTO;
import com.restaurante.api.entity.ItemPedido;
import com.restaurante.api.service.ComandaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comanda")
@CrossOrigin(origins = "*")
public class ComandaController {

    private final ComandaService service;

    public ComandaController(ComandaService service) {
        this.service = service;
    }

    @PostMapping("/adicionar")
    public ResponseEntity<ItemPedido> adicionar(@RequestBody AdicionarItemDTO dto) {
        return ResponseEntity.ok(service.adicionarItem(dto));
    }

    @GetMapping("/mesa/{idMesa}")
    public ResponseEntity<List<DetalhePedidoDTO>> listar(@PathVariable Long idMesa) {
        return ResponseEntity.ok(service.listarItens(idMesa));
    }

    @DeleteMapping("/item/{idItem}")
    public ResponseEntity<Void> cancelarItem(@PathVariable Long idItem) {
        service.cancelarItem(idItem);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/transferir-item")
    public ResponseEntity<Void> transferirItem(@RequestBody TransferirItemDTO dto) {
        service.transferirItem(dto);
        return ResponseEntity.ok().build();
    }
}