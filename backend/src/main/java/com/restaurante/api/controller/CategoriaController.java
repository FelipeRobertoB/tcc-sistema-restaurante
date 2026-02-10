package com.restaurante.api.controller;

import com.restaurante.api.dto.CategoriaDTO;
import com.restaurante.api.entity.Categoria;
import com.restaurante.api.entity.Setor;
import com.restaurante.api.repository.CategoriaRepository;
import com.restaurante.api.repository.SetorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categorias")
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;
    private final SetorRepository setorRepository;

    public CategoriaController(CategoriaRepository categoriaRepository, SetorRepository setorRepository) {
        this.categoriaRepository = categoriaRepository;
        this.setorRepository = setorRepository;
    }

    @GetMapping
    public List<CategoriaDTO> listar() {
        return categoriaRepository.findAll().stream()
                .map(c -> new CategoriaDTO(
                        c.getId(),
                        c.getNome(),
                        c.getSetor().getId(),
                        c.getSetor().getNome()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<Categoria> criar(@RequestBody CategoriaDTO dto) {
        Setor setor = setorRepository.findById(dto.setorId())
                .orElseThrow(() -> new RuntimeException("Setor não encontrado"));

        Categoria nova = new Categoria();
        nova.setNome(dto.nome());
        nova.setSetor(setor);

        return ResponseEntity.ok(categoriaRepository.save(nova));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        categoriaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}