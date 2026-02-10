import Button from "../../ui/Button";
import { UserPlus } from "lucide-react";

export default function MesaLivreWidget({ mesa, onAbrir }) {
  return (
    <div className="center-box">
      <div className="icon-circle">
        <UserPlus size={40} />
      </div>

      <h3>Mesa Disponível</h3>
      <p className="text-muted" style={{ marginBottom: '30px' }}>
        A mesa {mesa.numero} está pronta para receber clientes.
      </p>

      <Button onClick={onAbrir} size="lg" icon={UserPlus} style={{ width: '100%' }}>
        Abrir Mesa
      </Button>
    </div>
  );
}