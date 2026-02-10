import Button from "../ui/Button";
import Input from "../ui/Input";
import { Search, LayoutGrid, Users, Banknote, Sparkles } from "lucide-react";

export default function DashboardControls({ 
    inputValue, 
    setInputValue, 
    onSearch, 
    filtroAtual, 
    setFiltro, 
    stats 
}) {
    const filtros = [
        { 
            key: "TODAS", 
            label: "Todas", 
            icon: LayoutGrid, 
            count: stats?.total || 0,
            activeClass: "all" 
        },
        { 
            key: "OCUPADAS", 
            label: "Ocupadas", 
            icon: Users, 
            count: stats?.ocupadas || 0,
            activeClass: "occupied" 
        },
        { 
            key: "PAGANDO", 
            label: "Pagando", 
            icon: Banknote, 
            count: stats?.pagando || 0,
            activeClass: "paying" 
        },
        { 
            key: "LIVRES", 
            label: "Livres", 
            icon: Sparkles, 
            count: stats?.livres || 0,
            activeClass: "free" 
        }
    ];

    return (
        <div className="dashboard-controls fade-in">
            <form onSubmit={onSearch} className="control-search">
                <div style={{ flex: 1 }}>
                    <Input 
                        type="number" 
                        min="1"
                        placeholder="Mesa nº..." 
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={(e) => ["-", "e", "E", "+", "."].includes(e.key) && e.preventDefault()}
                        className="form-input"
                    />
                </div>
                <Button 
                    type="submit" 
                    variant="outline" 
                    icon={Search}
                    title="Buscar Mesa"
                />
            </form>
            <div className="control-filters">
                {filtros.map((filtro) => {
                    const isActive = filtroAtual === filtro.key;
                    const Icon = filtro.icon;

                    return (
                        <Button
                            key={filtro.key}
                            variant="ghost"
                            className={`filter-pill ${filtro.activeClass} ${isActive ? 'active' : ''}`}
                            onClick={() => setFiltro(filtro.key)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{filtro.label}</span>
                                <span style={{ 
                                    fontSize: '0.75rem', 
                                    opacity: isActive ? 1 : 0.6,
                                    backgroundColor: isActive ? 'rgba(255,255,255,0.5)' : 'var(--bg-input)',
                                    padding: '1px 6px',
                                    borderRadius: '10px'
                                }}>
                                    {filtro.count}
                                </span>
                            </div>
                        </Button>
                    );
                })}
            </div>

        </div>
    );
}