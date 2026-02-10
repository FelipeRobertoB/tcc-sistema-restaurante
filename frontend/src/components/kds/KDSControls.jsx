import Button from "../ui/Button";
import { Filter } from "lucide-react";

export default function KDSControls({ setores, filtroAtual, setFiltro }) {
    return (
        <div className="kds-controls" style={{ 
            display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '5px', marginBottom: '20px' 
        }}>
            <Button
                variant={filtroAtual === "TODOS" ? "primary" : "outline"}
                onClick={() => setFiltro("TODOS")}
                icon={Filter}
                className="btn-rounded"
            >
                Todos
            </Button>

            {setores.map(setor => (
                <Button
                    key={setor}
                    variant={filtroAtual === setor ? "primary" : "outline"}
                    onClick={() => setFiltro(setor)}
                    className="btn-rounded"
                    style={{ textTransform: 'capitalize' }}
                >
                    {setor.toLowerCase()}
                </Button>
            ))}
        </div>
    );
}