import clsx from "clsx";
import "./styles.css";

export default function Table({ 
  columns, 
  data = [], 
  keyExtractor = "id", 
  emptyMessage = "Nenhum registro.",
  maxHeight,
  className,
  rowClassName 
}) {

  return (
    <div className={clsx("table-container", className)}>
      <div className="table-scroll" style={{ maxHeight }}>
        <table className="ui-table">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  style={{ width: col.width }}
                  className={clsx(
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center'
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => {
                const rowKey = row[keyExtractor] || rowIndex;
                const customRowClass = rowClassName ? rowClassName(row) : "";
                return (
                  <tr key={rowKey} className={customRowClass}>
                    {columns.map((col, colIndex) => (
                      <td 
                        key={`${rowKey}-${colIndex}`}
                        className={clsx(
                          col.align === 'right' && 'text-right',
                          col.align === 'center' && 'text-center'
                        )}
                      >
                        {col.render 
                          ? col.render(row) 
                          : (col.accessor ? row[col.accessor] : "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length} className="table-empty">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}