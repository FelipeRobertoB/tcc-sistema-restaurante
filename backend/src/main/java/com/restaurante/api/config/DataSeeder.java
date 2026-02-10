package com.restaurante.api.config;

import com.restaurante.api.entity.Mesa;
import com.restaurante.api.enums.StatusMesa;
import com.restaurante.api.repository.MesaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DataSeeder {

    private static final int MAX_MESAS = 100;

    @Bean
    CommandLineRunner initDatabase(MesaRepository mesaRepository) {
        return args -> {
            if (mesaRepository.count() < MAX_MESAS) {
                for (int i = 1; i <= MAX_MESAS; i++) {
                    if (mesaRepository.findByNumero(i).isEmpty()) {
                        Mesa mesa = Mesa.builder()
                                .numero(i)
                                .status(StatusMesa.LIVRE)
                                .total(BigDecimal.ZERO)
                                .ativo(false)
                                .build();
                        mesaRepository.save(mesa);
                    }
                }
            }
        };
    }
}