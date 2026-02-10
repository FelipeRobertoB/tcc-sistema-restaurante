package com.restaurante.api.controller;
import com.restaurante.api.dto.PedidoLoteDTO;
import com.restaurante.api.dto.TransferirMesaDTO;
import com.restaurante.api.entity.Mesa;
import com.restaurante.api.enums.StatusMesa;
import com.restaurante.api.repository.MesaRepository;
import com.restaurante.api.service.MesaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/mesas")
@CrossOrigin(origins = "*")
public class MesaController {

    private final MesaService service;
    private final MesaRepository repository;

    public MesaController(MesaService service, MesaRepository repository) {
        this.service = service;
        this.repository = repository;
    }

    @GetMapping
    public List<Mesa> listarTodas() {
        return repository.findByAtivoTrueOrderByNumeroAsc();
    }

    @PostMapping
    public ResponseEntity<?> ativarMesa(@RequestBody Map<String, Integer> payload) {
        Integer numero = payload.get("numero");

        if (numero == null) return ResponseEntity.badRequest().body("Número inválido.");

        Optional<Mesa> mesaOpt = repository.findByNumero(numero);

        if (mesaOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body("Número de mesa inválido. Limite do sistema excedido ou mesa inexistente.");
        }

        Mesa mesa = mesaOpt.get();

        if (Boolean.TRUE.equals(mesa.getAtivo())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("A Mesa " + numero + " já está ativa no sistema.");
        }

        mesa.setAtivo(true);
        if (mesa.getStatus() == null) mesa.setStatus(StatusMesa.LIVRE);

        return ResponseEntity.ok(repository.save(mesa));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> desativarMesa(@PathVariable Long id) {
        Mesa mesa = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa não encontrada"));
        if (mesa.getStatus() != StatusMesa.LIVRE) {
            return ResponseEntity.status(HttpStatus.CONFLICT) // 409
                    .body("Não é possível remover a Mesa " + mesa.getNumero() + " pois ela não está LIVRE.");
        }
        mesa.setAtivo(false);
        repository.save(mesa);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/abrir")
    public ResponseEntity<Void> abrir(@PathVariable Long id) {
        service.abrirMesa(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/reabrir")
    public ResponseEntity<Void> reabrir(@PathVariable Long id) {
        service.reabrirMesa(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/cancelar")
    public ResponseEntity<Void> cancelarAtendimento(@PathVariable Long id) {
        service.cancelarAtendimento(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/pedidos/lote")
    public ResponseEntity<Mesa> adicionarPedidosEmLote(@PathVariable Long id, @RequestBody PedidoLoteDTO loteDto) {
        Mesa mesaAtualizada = service.adicionarItensEmLote(id, loteDto.itens());
        return ResponseEntity.ok(mesaAtualizada);
    }

    @PostMapping("/transferir-mesa")
    public ResponseEntity<Void> transferirMesa(@RequestBody TransferirMesaDTO dto) {
        service.transferirMesa(dto);
        return ResponseEntity.ok().build();
    }
}