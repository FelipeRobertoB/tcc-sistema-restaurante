package com.restaurante.api.controller;

import com.restaurante.api.dto.ContaDTO;
import com.restaurante.api.dto.FecharContaDTO;
import com.restaurante.api.service.PagamentoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/pagamento")
@CrossOrigin(origins = "*")
public class PagamentoController {

    private final PagamentoService service;

    public PagamentoController(PagamentoService service) {
        this.service = service;
    }

    @PostMapping("/conta/{idMesa}")
    public ResponseEntity<ContaDTO> solicitarConta(@PathVariable Long idMesa) {
        return ResponseEntity.ok(service.solicitarConta(idMesa));
    }

    @PostMapping("/fechar")
    public ResponseEntity<Void> fecharConta(@RequestBody FecharContaDTO dto) {
        service.fecharConta(dto);
        return ResponseEntity.ok().build();
    }
}