import "./styles.css";

export default function Header({ title, subtitle, center, children, className, fullWidth = false }) {
  return (
    <header className={`app-header ${className || ''}`}>
      <div className={`header-content ${fullWidth ? 'full-width' : ''}`}>
        <div className="header-left">
          <h1>{title}</h1>
          {subtitle && <span className="header-subtitle">{subtitle}</span>}
        </div>
        <div className="header-center">
            {center}
        </div>
        <div className="header-right">
          {children}
        </div>
        
      </div>
    </header>
  );
}