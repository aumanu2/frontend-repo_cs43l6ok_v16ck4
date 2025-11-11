export function Table({ columns=[], data=[] }){
  return (
    <div className="overflow-auto border border-neutral-200 dark:border-neutral-800 rounded-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500">
          <tr>
            {columns.map(c => (
              <th key={c.accessor} className="text-left font-medium px-4 py-3 whitespace-nowrap">{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50">
              {columns.map(c => (
                <td key={c.accessor} className="px-4 py-3 whitespace-nowrap">{c.cell? c.cell(row[c.accessor], row): (row[c.accessor]??'—')}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
