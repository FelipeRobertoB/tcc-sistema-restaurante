package com.restaurante.api.controller;

import com.restaurante.api.entity.Setor;
import com.restaurante.api.repository.SetorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/setores")
@CrossOrigin(origins = "*")
public class SetorController {

    private final SetorRepository repository;

    public SetorController(SetorRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Setor> listar() {
        return repository.findAll();
    }

    @PostMapping
    public Setor criar(@RequestBody Setor setor) {
        return repository.save(setor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}