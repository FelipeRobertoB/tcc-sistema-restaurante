package com.restaurante.api.controller;

import com.restaurante.api.entity.Produto;
import com.restaurante.api.enums.StatusProduto;
import com.restaurante.api.repository.ProdutoRepository;
import com.restaurante.api.service.ProdutoService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoRepository produtoRepository;
    private final ProdutoService produtoService;

    public ProdutoController(ProdutoRepository produtoRepository, ProdutoService produtoService) {
        this.produtoRepository = produtoRepository;
        this.produtoService = produtoService;
    }

    @GetMapping
    public ResponseEntity<List<Produto>> listarTodos(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) String termo,
            @RequestParam(required = false, defaultValue = "false") Boolean somenteAtivos
    ) {
        List<Produto> produtos;

        if (termo != null && !termo.isEmpty()) {
            produtos = produtoRepository.buscarPorNomeOuCodigo(termo);
        } else if (categoriaId != null) {
            produtos = produtoRepository.findByCategoriaId(categoriaId);
        } else {
            produtos = produtoRepository.findAll();
        }

        if (Boolean.TRUE.equals(somenteAtivos)) {
            produtos = produtos.stream()
                    .filter(p -> p.getStatus() == StatusProduto.ATIVO)
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(produtos);
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Produto produto) {
        try {
            return ResponseEntity.ok(produtoService.salvar(produto));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensagemErro(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Produto produto) {
        if (!produtoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        produto.setId(id);

        try {
            return ResponseEntity.ok(produtoService.salvar(produto));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MensagemErro(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if (!produtoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            produtoRepository.deleteById(id);
            return ResponseEntity.noContent().build();

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new MensagemErro("Não é possível excluir: este produto sendo usado em alguma mesa."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MensagemErro("Erro interno ao tentar excluir o produto."));
        }
    }

    record MensagemErro(String message) {}
}