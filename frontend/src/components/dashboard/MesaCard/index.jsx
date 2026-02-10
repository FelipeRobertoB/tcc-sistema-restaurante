import { User, Armchair, Receipt } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"; 
import "./styles.css";

const STATUS_CONFIG = {
  LIVRE: {
    label: "Livre",
    icon: Armchair,
    iconColor: "var(--text-secondary)", 
    borderColor: "var(--border-color)",
    bg: "var(--bg-input)" 
  },
  ABERTA: {
    label: "Ocupada",
    icon: User,
    iconColor: "var(--success)",
    borderColor: "var(--success)",
    bg: "rgba(34, 197, 94, 0.1)"
  },
  FECHADA: {
    label: "Pagando",
    icon: Receipt,
    iconColor: "var(--danger)",
    borderColor: "var(--danger)",
    bg: "rgba(239, 68, 68, 0.1)"
  }
};

export default function MesaCard({ mesa, onClick }) {
  const config = STATUS_CONFIG[mesa.status] || STATUS_CONFIG.LIVRE;
  const Icon = config.icon;
  
  const totalFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(mesa.total || 0);

  return (
    <Card 
      hoverable 
      onClick={() => onClick(mesa)}
      className="mesa-widget fade-in"
      style={{ 
        "--status-color": config.borderColor,
        cursor: 'pointer'
      }}
    >
      <CardHeader className="p-3 pb-2">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{ 
                backgroundColor: config.bg, 
                color: config.iconColor, 
                padding: '8px', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
               <Icon size={20} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Mesa
                </span>
                <CardTitle style={{ fontSize: '1.25rem', lineHeight: '1' }}>
                    {mesa.numero}
                </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-2">
        <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '8px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <span 
                style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: 600, 
                    color: config.iconColor 
                }}
             >
                {config.label}
             </span>
             {mesa.status !== 'LIVRE' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-primary)', fontWeight: 700 }}>
                    <span style={{ fontSize: '0.9rem' }}>{totalFormatado}</span>
                </div>
             )}
        </div>
      </CardContent>
    </Card>
  );
}