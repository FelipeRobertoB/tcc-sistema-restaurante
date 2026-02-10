import { useState } from "react";
import AdminFiltros from "./AdminFiltros";
import ListaProdutos from "./ListaProdutos";
import FormProduto from "./FormProduto";

export default function ProdutosWidget({ 
    produtos, categorias, 
    termo, setTermo, cat, setCat,
    onSalvar, onDeletar 
}) {
    const [produtoEditando, setProdutoEditando] = useState(null);

    return (
        <div className="admin-products-container">
            <div className="col-left">
                <AdminFiltros 
                    termo={termo} setTermo={setTermo}
                    cat={cat} setCat={setCat}
                    categorias={categorias}
                />
                
                <div className="panel-dark panel-scroll">
                    <ListaProdutos 
                        produtos={produtos}
                        onEditar={setProdutoEditando}
                        onDeletar={onDeletar}
                    />
                </div>
            </div>
            <div className="col-right">
                <FormProduto 
                    produtoEditando={produtoEditando}
                    categorias={categorias}
                    onSalvar={async (prod) => {
                        const sucesso = await onSalvar(prod);
                        if(sucesso) setProdutoEditando(null);
                    }}
                    onCancelar={() => setProdutoEditando(null)}
                />
            </div>
        </div>
    );
}