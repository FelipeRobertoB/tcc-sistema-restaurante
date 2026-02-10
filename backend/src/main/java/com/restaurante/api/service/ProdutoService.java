package com.restaurante.api.service;

import com.restaurante.api.entity.Produto;
import com.restaurante.api.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ProdutoService {

    private final ProdutoRepository repository;

    public ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Produto salvar(Produto produto) {

        if (produto.getNome() == null || produto.getNome().trim().length() < 2) {
            throw new RuntimeException("O nome do produto deve ter pelo menos 2 letras.");
        }

        if (produto.getNome().matches("\\d+")) {
            throw new RuntimeException("O nome do produto não pode ser apenas números.");
        }

        if (produto.getPreco() == null || produto.getPreco().doubleValue() <= 0) {
            throw new RuntimeException("O preço deve ser maior que zero.");
        }

        if (produto.getCodigo() == null || produto.getCodigo().trim().isEmpty()) {
            Long max = repository.findMaxCodigo();
            long proximo = (max != null ? max : 0) + 1;
            produto.setCodigo(String.valueOf(proximo));
        }

        Optional<Produto> existente = repository.findByCodigo(produto.getCodigo());

        if (existente.isPresent()) {
            if (produto.getId() == null || !existente.get().getId().equals(produto.getId())) {
                throw new RuntimeException("Código '" + produto.getCodigo() + "' já está em uso por: " + existente.get().getNome());
            }
        }

        return repository.save(produto);
    }
}