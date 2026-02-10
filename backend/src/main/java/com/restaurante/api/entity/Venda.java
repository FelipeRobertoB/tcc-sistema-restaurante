package com.restaurante.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_venda")
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "mesa_origem_id")
    private Long idMesaOrigem;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal taxaServico;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal desconto;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valorFinal;

    @Column(nullable = false)
    private LocalDateTime dataHora;

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Pagamento> pagamentos = new ArrayList<>();

    @OneToMany(mappedBy = "venda")
    @ToString.Exclude
    private List<ItemPedido> itens;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Venda venda = (Venda) o;
        return id != null && Objects.equals(id, venda.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}