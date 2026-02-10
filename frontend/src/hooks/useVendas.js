import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../services/api";
import { formatPaymentMethod } from "../utils/format"; 

export function useVendas() {
    const getHoje = () => {
        const date = new Date();
        const ano = date.getFullYear();
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const dia = String(date.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    };

    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataInicio, setDataInicio] = useState(getHoje());
    const [dataFim, setDataFim] = useState(getHoje());

    const fetchVendas = useCallback(async () => {
        setLoading(true);
        try {
            const params = `?inicio=${dataInicio}&fim=${dataFim}`;
            const res = await api.get(`/vendas${params}`);
            setVendas(res.data);
        } catch (error) {
            console.error("Erro ao buscar vendas:", error);
        } finally {
            setLoading(false);
        }
    }, [dataInicio, dataFim]);

    useEffect(() => {
        fetchVendas();
    }, [fetchVendas]);

    const resumo = useMemo(() => {
        const stats = {
            faturamento: 0,   
            liquido: 0,       
            taxas: 0,         
            descontos: 0,   
            qtdVendas: 0,
            ticketMedio: 0,
            metodos: {}      
        };

        vendas.forEach(venda => {
            const bruto = venda.valorTotal || venda.total || 0;
            const final = venda.valorFinal !== undefined ? venda.valorFinal : bruto;
            const desconto = venda.desconto || 0;
            const taxa = venda.taxaServico || 0;

            stats.faturamento += bruto;
            stats.liquido += final;
            stats.descontos += desconto;
            stats.taxas += taxa;
            stats.qtdVendas += 1;

            if (venda.pagamentos) {
                venda.pagamentos.forEach(pgtoStr => {
                    try {
                        const [metodo, valorStr] = pgtoStr.split(': R$ ');
                        const valor = parseFloat(valorStr);
                        
                        if (metodo && !isNaN(valor)) {
                            const chave = metodo.trim(); 
                            if (!stats.metodos[chave]) stats.metodos[chave] = 0;
                            stats.metodos[chave] += valor;
                        }
                    } catch (e) {
                        console.error("Erro parse pagamento:", pgtoStr);
                    }
                });
            }
        });

        if (stats.qtdVendas > 0) {
            stats.ticketMedio = stats.liquido / stats.qtdVendas;
        }

        const metodosOrdenados = Object.entries(stats.metodos)
            .sort(([, a], [, b]) => b - a) 
            .map(([chaveRaw, valor]) => ({
                nome: formatPaymentMethod(chaveRaw), 
                valor,
                porcentagem: (valor / stats.liquido) * 100
            }));

        return { ...stats, metodosOrdenados };

    }, [vendas]);

    return {
        vendas,
        loading,
        dataInicio,
        setDataInicio,
        dataFim,
        setDataFim,
        resumo,
        atualizar: fetchVendas
    };
}