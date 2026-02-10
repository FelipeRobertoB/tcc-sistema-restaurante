import { useState } from "react";
import api from "../services/api";

export function useCheckout(mesaId, onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const realizarFechamento = async (pagamentos, totalFinal, incluirTaxa, valorDesconto) => {
        setLoading(true);
        setError(null);

        const totalPago = pagamentos.reduce((acc, p) => acc + p.valor, 0);

        if (totalPago < totalFinal - 0.01) { 
            setLoading(false);
            alert(`Valor insuficiente! Faltam R$ ${(totalFinal - totalPago).toFixed(2)}`);
            return;
        }

        if (pagamentos.length === 0 && totalFinal > 0) {
            setLoading(false);
            alert("Nenhum pagamento informado.");
            return;
        }

        try {
            const payload = {
                idMesa: mesaId,
                totalFinal: totalFinal,
                taxaServicoCobrada: incluirTaxa, 
                desconto: valorDesconto,
                listaPagamentos: pagamentos.map(p => ({
                    metodo: p.metodo,
                    valor: p.valor
                }))
            };

            await api.post("/pagamento/fechar", payload);
            alert("Venda finalizada com sucesso! 🎉");
            if (onSuccess) {
                await onSuccess(); 
            }

        } catch (err) {
            console.error("Erro checkout:", err);
            const msg = err.response?.data?.message || "Erro ao processar venda.";
            setError(msg);
            alert("❌ " + msg);
        } finally {
            setLoading(false);
        }
    };

    return { realizarFechamento, loading, error };
}