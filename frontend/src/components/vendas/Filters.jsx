import { Calendar } from "lucide-react";

export default function Filters({ dataInicio, setDataInicio, dataFim, setDataFim }) {
    return (
        <div className="filter-bar">
            <div className="date-inputs">
                <div className="input-group">
                    <Calendar size={16} />
                    <input 
                        type="date" 
                        value={dataInicio} 
                        onChange={e => setDataInicio(e.target.value)} 
                    />
                </div>
                <span className="separator">até</span>
                <div className="input-group">
                    <Calendar size={16} />
                    <input 
                        type="date" 
                        value={dataFim} 
                        onChange={e => setDataFim(e.target.value)} 
                    />
                </div>
            </div>
        </div>
    );
}