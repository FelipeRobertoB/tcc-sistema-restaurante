import Input from "../ui/Input";
import Select from "../ui/Select"; 

export default function AdminFiltros({ termo, setTermo, cat, setCat, categorias }) {
    return (
        <div className="panel-dark" style={{ padding: '16px', display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '15px' }}>
            
            <div style={{ flex: 1.5 }}>
                <Input 
                    label="Pesquisar" 
                    value={termo} 
                    onChange={e => setTermo(e.target.value)} 
                    placeholder="Nome ou código..." 
                />
            </div>

            <div style={{ flex: 1 }}>
                <Select 
                    label="Filtrar Categoria"
                    value={cat} 
                    onChange={e => setCat(e.target.value)}
                    placeholder="Todas"
                    disabled={termo.length > 0}
                    options={categorias.map(c => ({ value: c.id, label: c.nome }))}
                />
            </div>
        </div>
    );
}