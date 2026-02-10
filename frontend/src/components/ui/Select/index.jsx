import { ChevronDown } from "lucide-react";
import "./styles.css";

export default function Select({ 
    label, 
    value, 
    onChange, 
    options = [], 
    placeholder, 
    disabled, 
    required,
    style 
}) {
    return (
        <div className="select-wrapper" style={style}>
            {label && <label className="select-label">{label}</label>}
            
            <div className="select-container">
                <select
                    className={`custom-select ${!value ? 'placeholder' : ''}`}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="select-icon" size={16} />
            </div>
        </div>
    );
}