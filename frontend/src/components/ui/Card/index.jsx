import clsx from "clsx";
import "./styles.css";

export function Card({ className, hoverable, children, ...props }) {
  return (
    <div 
      className={clsx(
        "card", 
        hoverable && "card--hoverable",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return <div className={clsx("card-header", className)} {...props}>{children}</div>;
}

export function CardTitle({ className, children, ...props }) {
  return <h3 className={clsx("card-title", className)} {...props}>{children}</h3>;
}

export function CardDescription({ className, children, ...props }) {
  return <p className={clsx("card-description", className)} {...props}>{children}</p>;
}

export function CardContent({ className, children, ...props }) {
  return <div className={clsx("card-content", className)} {...props}>{children}</div>;
}

export function CardFooter({ className, children, ...props }) {
  return <div className={clsx("card-footer", className)} {...props}>{children}</div>;
}