import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import { ArrowLeft } from "lucide-react";
import SetoresWidget from "../../components/admin/SetoresWidget";
import CategoriasWidget from "../../components/admin/CategoriasWidget";
import ProdutosWidget from "../../components/admin/ProdutosWidget";
import MesasWidget from "../../components/admin/MesasWidget";
import "../../components/admin/admin.css";
import "./styles.css";

export default function Admin() {
    const navigate = useNavigate();
    const [abaAtiva, setAbaAtiva] = useState("PRODUTOS")

    const {
        setores, categorias, produtos, mesas, loading,
        filtroCategoria, setFiltroCategoria,
        termoBusca, setTermoBusca,
        criarSetor, deletarSetor,
        criarCategoria, deletarCategoria,
        salvarProduto, deletarProduto,
        criarMesa, deletarMesa
    } = useAdmin();

    return (
        <div className="admin-page fade-in">
            <Header 
                title="Administração" 
                center={<span>Gerenciamento Geral</span>}
                fullWidth={true}
            >
                <Button variant="outline" onClick={() => navigate('/')} icon={ArrowLeft}>
                    Voltar
                </Button>
            </Header>

            <div className="admin-container">
                
                <div className="admin-tabs">
                    <button 
                        className={`tab-btn ${abaAtiva === 'SETORES' ? 'active' : ''}`} 
                        onClick={() => setAbaAtiva('SETORES')}
                    >
                        1. Setores
                    </button>
                    <button 
                        className={`tab-btn ${abaAtiva === 'CATEGORIAS' ? 'active' : ''}`} 
                        onClick={() => setAbaAtiva('CATEGORIAS')}
                    >
                        2. Categorias
                    </button>
                    <button 
                        className={`tab-btn ${abaAtiva === 'PRODUTOS' ? 'active' : ''}`} 
                        onClick={() => setAbaAtiva('PRODUTOS')}
                    >
                        3. Produtos
                    </button>
                    <button 
                        className={`tab-btn ${abaAtiva === 'MESAS' ? 'active' : ''}`} 
                        onClick={() => setAbaAtiva('MESAS')}
                    >
                        4. Mesas
                    </button>
                </div>
                
                <div className="admin-content">
                    
                    {abaAtiva === 'SETORES' && (
                        <SetoresWidget 
                            setores={setores} 
                            onCriar={criarSetor} 
                            onDeletar={deletarSetor} 
                        />
                    )}

                    {abaAtiva === 'CATEGORIAS' && (
                        <CategoriasWidget 
                            categorias={categorias} 
                            setores={setores}
                            onCriar={criarCategoria} 
                            onDeletar={deletarCategoria} 
                        />
                    )}

                    {abaAtiva === 'PRODUTOS' && (
                        <ProdutosWidget 
                            produtos={produtos}
                            categorias={categorias}
                            termo={termoBusca} setTermo={setTermoBusca}
                            cat={filtroCategoria} setCat={setFiltroCategoria}
                            onSalvar={salvarProduto}
                            onDeletar={deletarProduto}
                        />
                    )}

                    {abaAtiva === 'MESAS' && (
                        <MesasWidget 
                            mesas={mesas}
                            onCriar={criarMesa}
                            onDeletar={deletarMesa}
                        />
                    )}

                </div>
            </div>
        </div>
    );
}