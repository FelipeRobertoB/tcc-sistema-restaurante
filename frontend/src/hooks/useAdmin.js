import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useAdmin() {
    const [setores, setSetores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [mesas, setMesas] = useState([]); 
    const [loading, setLoading] = useState(false);
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [termoBusca, setTermoBusca] = useState("");
    const carregarSetores = useCallback(async () => {
        try {
            const res = await api.get("/setores");
            setSetores(res.data);
        } catch (e) { console.error("Erro setores", e); }
    }, []);

    const carregarCategorias = useCallback(async () => {
        try {
            const res = await api.get("/categorias");
            setCategorias(res.data);
        } catch (e) { console.error("Erro categorias", e); }
    }, []);

    const carregarMesas = useCallback(async () => {
        try {
            const res = await api.get("/mesas");
            const ordenadas = res.data.sort((a, b) => a.numero - b.numero);
            setMesas(ordenadas);
        } catch (error) { console.error("Erro mesas", error); }
    }, []);

    const atualizarListaProdutos = useCallback(async () => {
        setLoading(true);
        try {
            let url = "/produtos";
            if (termoBusca) url = `/produtos?termo=${termoBusca}`;
            else if (filtroCategoria) url = `/produtos?categoriaId=${filtroCategoria}`;

            const res = await api.get(url);
            let lista = res.data;
            if(termoBusca) {
                lista = lista.filter(p => 
                    p.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
                    String(p.codigo).includes(termoBusca)
                );
            }
            
            setProdutos(lista.sort((a, b) => (a.codigo || 9999) - (b.codigo || 9999)));
        } catch (e) { console.error("Erro produtos", e); }
        finally { setLoading(false); }
    }, [filtroCategoria, termoBusca]);
    useEffect(() => {
        carregarSetores();
        carregarCategorias();
        carregarMesas();
    }, [carregarSetores, carregarCategorias, carregarMesas]);
    useEffect(() => {
        atualizarListaProdutos();
    }, [atualizarListaProdutos]);
    const criarSetor = async (nome) => {
        if (!nome) return;
        try {
            await api.post("/setores", { nome });
            carregarSetores();
        } catch (e) { alert("Erro ao criar setor."); }
    };

    const deletarSetor = async (id) => {
        if (!confirm("Excluir setor? Isso pode afetar categorias vinculadas.")) return;
        try {
            await api.delete(`/setores/${id}`);
            carregarSetores();
        } catch (e) { alert("Erro ao deletar setor (verifique se há categorias vinculadas)."); }
    };
    const criarCategoria = async (dados) => {
        if (!dados.nome || !dados.setorId) return alert("Preencha nome e setor");
        try {
            await api.post("/categorias", dados);
            carregarCategorias();
        } catch (e) { alert("Erro ao criar categoria."); }
    };
    
    const deletarCategoria = async (id) => {
        if (!confirm("Excluir categoria?")) return;
        try {
            await api.delete(`/categorias/${id}`);
            carregarCategorias(); 
        } catch (e) { alert("Erro ao deletar categoria."); }
    };
    const criarMesa = async (numero) => {
        try {
            await api.post("/mesas", { numero: parseInt(numero) });
            carregarMesas();
        } catch (e) { alert("Erro ao criar mesa (verifique se já existe)."); }
    };

    const deletarMesa = async (id) => {
        if (!confirm("Excluir mesa?")) return;
        try {
            await api.delete(`/mesas/${id}`);
            carregarMesas();
        } catch (e) { alert("Erro ao deletar mesa."); }
    };
    const salvarProduto = async (produto) => {
        const dto = { 
            ...produto, 
            preco: parseFloat(produto.preco),
            status: produto.status || "ATIVO" 
        };
        try {
            if (produto.id) await api.put(`/produtos/${produto.id}`, dto);
            else await api.post("/produtos", dto);
            atualizarListaProdutos();
            return true; 
        } catch (error) {
            alert("Erro ao salvar: " + (error.response?.data?.message || error.message));
            return false;
        }
    };

    const deletarProduto = async (id) => {
        if (!confirm("Excluir produto?")) return;
        try {
            await api.delete(`/produtos/${id}`);
            atualizarListaProdutos();
        } catch (error) {
            if (error.response?.status === 409 || error.response?.status === 500) {
                if (confirm("Produto possui vendas. Deseja apenas INATIVAR?")) {
                    const prod = produtos.find(p => p.id === id);
                    if (prod) salvarProduto({ ...prod, status: 'INATIVO' });
                }
            } else {
                alert("Erro ao excluir.");
            }
        }
    };

    return {
        setores, categorias, produtos, mesas, loading,
        filtroCategoria, setFiltroCategoria,
        termoBusca, setTermoBusca,
        criarSetor, deletarSetor,
        criarCategoria, deletarCategoria,
        criarMesa, deletarMesa,
        salvarProduto, deletarProduto
    };
}