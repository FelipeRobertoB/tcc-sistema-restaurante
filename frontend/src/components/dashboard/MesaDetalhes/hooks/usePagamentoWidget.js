import { useState, useMemo, useEffect } from "react";
import { useCheckout } from "../../../../hooks/useCheckout";

export function usePagamentoWidget(mesa, itens, onFinalizar) {
    const [incluirTaxa, setIncluirTaxa] = useState(true);
    const [descontoDigitado, setDescontoDigitado] = useState(""); 
    const [pagamentos, setPagamentos] = useState([]); 
    const [metodoSelecionado, setMetodoSelecionado] = useState("DINHEIRO");
    const [valorInput, setValorInput] = useState("");
    const { realizarFechamento, loading } = useCheckout(mesa?.id, onFinalizar);
    const itensAgrupados = useMemo(() => {
        if (!itens) return [];
        const mapa = {};
        itens.forEach(item => {
            const chave = item.idProduto || item.nomeProduto || item.produto?.id;
            if (!mapa[chave]) {
                mapa[chave] = { ...item, quantidade: 0, totalAgrupado: 0 };
            }
            mapa[chave].quantidade += (item.quantidade || 1);
            mapa[chave].totalAgrupado += (item.valorTotal || item.total || 0);
        });
        return Object.values(mapa);
    }, [itens]);

    const resumo = useMemo(() => {
        const subtotal = itens ? itens.reduce((acc, i) => acc + (i.total || 0), 0) : 0;
        const valorTaxa = incluirTaxa ? subtotal * 0.10 : 0;
        const totalBruto = subtotal + valorTaxa;
        const totalPagoGeral = pagamentos.reduce((acc, p) => acc + p.valor, 0);
        const totalPagoIrreversivel = pagamentos
            .filter(p => p.metodo !== 'DINHEIRO')
            .reduce((acc, p) => acc + p.valor, 0);
        const maxDescontoPermitido = Math.max(0, totalBruto - totalPagoIrreversivel);
        const descontoUsuario = parseFloat(descontoDigitado) || 0;
        const descontoFinal = Math.min(descontoUsuario, maxDescontoPermitido);
        const totalLiquido = Math.max(0, totalBruto - descontoFinal);
        const diferenca = totalPagoGeral - totalLiquido;
        const faltaPagar = diferenca < -0.005 ? Math.abs(diferenca) : 0;
        const troco = diferenca > 0.005 ? diferenca : 0;
        return { subtotal, valorTaxa, totalBruto, maxDescontoPermitido, descontoFinal, totalLiquido, faltaPagar, troco };
    }, [itens, incluirTaxa, descontoDigitado, pagamentos]);
    useEffect(() => {
        if (resumo.faltaPagar > 0.01) setValorInput(resumo.faltaPagar.toFixed(2));
        else setValorInput("");
    }, [resumo.faltaPagar]);
    const handlers = {
        changeDesconto: (e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val)) val = "";
            if (val > resumo.maxDescontoPermitido + 0.01) val = resumo.maxDescontoPermitido; 
            setDescontoDigitado(val);
        },
        addPagamento: (e) => {
            if(e) e.preventDefault();
            const valor = parseFloat(valorInput);
            if (!valor || valor <= 0) return;
            if (metodoSelecionado !== "DINHEIRO" && valor > resumo.faltaPagar + 0.01) {
                return alert("Pagamento em cartão/pix não pode gerar troco.");
            }
            setPagamentos([...pagamentos, { id: Date.now(), metodo: metodoSelecionado, valor }]);
        },
        removePagamento: (id) => setPagamentos(pagamentos.filter(p => p.id !== id)),
        
        confirmar: () => {
            if (resumo.faltaPagar > 0.01) return;
            realizarFechamento(
                pagamentos, 
                resumo.totalLiquido, 
                incluirTaxa, 
                resumo.descontoFinal
            );
        },
        toggleTaxa: () => setIncluirTaxa(!incluirTaxa),
        setMetodo: setMetodoSelecionado,
        setValor: setValorInput
    };
    return {
        itensAgrupados,
        resumo,
        pagamentos,
        loading,
        incluirTaxa,
        descontoDigitado,
        metodoSelecionado,
        valorInput,
        ...handlers
    };
}