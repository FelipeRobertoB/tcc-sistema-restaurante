import { Loader2, SearchX } from "lucide-react";
import MesaCard from "./MesaCard";

export default function MesaGrid({ mesas, loading, onSelect }) {
    
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '60px', color: 'var(--text-secondary)', height: '100%'
            }}>
                <Loader2 className="animate-spin" size={40} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>Carregando mesas...</p>
            </div>
        );
    }

    if (!mesas || mesas.length === 0) {
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: '60px', 
                color: 'var(--text-muted)',
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'var(--bg-surface)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'
            }}>
                <div style={{ padding: '16px', background: 'var(--bg-input)', borderRadius: '50%' }}>
                    <SearchX size={32} />
                </div>
                <div>
                    <h3 style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>Nenhuma mesa encontrada</h3>
                    <p style={{ fontSize: '0.9rem' }}>Verifique os filtros ou tente outro número.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 'var(--space-4)',
            paddingBottom: 'var(--space-8)'
        }}>
            {mesas.map((mesa) => (
                <MesaCard 
                    key={mesa.id || mesa.numero} 
                    mesa={mesa} 
                    onClick={onSelect} 
                />
            ))}
        </div>
    );
}