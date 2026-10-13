// Componente base de tabela reutilizável
export default function TableBase({ columns, data, wrapperClassName = "w-full", tableClassName = "w-full table-fixed" }) {
  return (
    <div className={`${wrapperClassName} overflow-x-auto`}>
      <div className="h-fit max-h-[calc(100vh-300px)] overflow-y-auto">
        <table className={`${tableClassName} border-separate border-spacing-0 rounded-lg overflow-hidden shadow-md`}>
          <thead className="sticky top-0 z-10">
            <tr className="border-b-2 border-gray-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-semibold text-gray-800 text-md bg-gray-200 ${col.className || ''}`}
                  style={col.style}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {data.map((row, idx) => (
              <tr key={row.id || idx} className="border-b border-gray-200 odd:bg-white even:bg-gray-100 hover:bg-orange-100 transition-colors duration-150">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-sm align-middle ${col.tdClassName || ''}`}
                    style={col.tdStyle}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
