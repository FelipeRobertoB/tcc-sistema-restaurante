package com.restaurante.api.controller;

import com.restaurante.api.dto.FecharContaDTO;
import com.restaurante.api.dto.VendaResponseDTO;
import com.restaurante.api.entity.Venda;
import com.restaurante.api.service.VendaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vendas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class VendaController {

    private final VendaService vendaService;

    @PostMapping("/fechar")
    public ResponseEntity<?> fecharVenda(@RequestBody FecharContaDTO dto) {
        try {
            Venda venda = vendaService.fecharConta(dto);
            return ResponseEntity.ok(VendaResponseDTO.fromEntity(venda));

        } catch (Exception e) {
            log.error("Erro ao tentar fechar a conta da mesa ID: {}", dto.idMesa(), e);

            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<VendaResponseDTO>> listarHistorico(
            @RequestParam(required = false) String inicio,
            @RequestParam(required = false) String fim
    ) {
        return ResponseEntity.ok(vendaService.listarVendas(inicio, fim));
    }
}