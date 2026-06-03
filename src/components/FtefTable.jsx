function round2(value) {
  return Math.round(value * 100) / 100;
}

export default function FtefTable({
  ftefRows,
  updateFtefRow,
  deleteFtefRow,
  addFtefRow,
  calculateFtefRow,
  catalogHours,
  maxHours,
}) {
  const cellClass = "border border-gray-300 p-2.5 text-left align-middle";
  const headerClass = `${cellClass} bg-gray-100 font-bold`;
  const inputClass = "w-full max-w-[140px] rounded-md border border-gray-300 px-2 py-2 text-sm";
  const buttonClass =
    "mt-3 cursor-pointer rounded-lg border-0 bg-blue-600 px-3.5 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500";

  return (
    <>
      <h2 className="mt-0 mb-2 text-center text-2xl font-bold">Instructor FTEF</h2>

      <div className="overflow-x-auto">
        <table className="mt-4 w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className={headerClass}>Workload Factor</th>
              <th className={headerClass}>Catalog Hours</th>
              <th className={headerClass}>FTEF %</th>
              <th className={headerClass}>Class Contact Hours</th>
              <th className={headerClass}>Instructor Assigned Hours</th>
              <th className={headerClass}>% of Assignment</th>
              <th className={headerClass}>Instructor FTEF</th>
              <th className={headerClass}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {ftefRows.map((row, index) => {
              const { ftefPercent, assignPercent, instructorFtef } =
                calculateFtefRow(row, catalogHours, maxHours);

              return (
                <tr key={index}>
                  <td className={cellClass}>
                    <input
                      className={inputClass}
                      type="number"
                      value={row.workloadFactor}
                      onChange={(event) =>
                        updateFtefRow(index, "workloadFactor", Number(event.target.value) || 0)
                      }
                    />
                  </td>

                  <td className={cellClass}>{catalogHours ?? ""}</td>
                  <td className={cellClass}>{round2(ftefPercent * 100)}%</td>
                  <td className={cellClass}>{maxHours ?? ""}</td>

                  <td className={cellClass}>
                    <input
                      className={inputClass}
                      type="number"
                      value={row.instructorAssignedHours}
                      onChange={(event) =>
                        updateFtefRow(index, "instructorAssignedHours", Number(event.target.value) || 0)
                      }
                    />
                  </td>

                  <td className={cellClass}>{round2(assignPercent * 100)}%</td>
                  <td className={cellClass}>{round2(instructorFtef * 100)}%</td>

                  <td className={cellClass}>
                    <button
                      className={buttonClass}
                      type="button"
                      onClick={() => deleteFtefRow(index)}
                      disabled={ftefRows.length === 1}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button className={buttonClass} type="button" onClick={addFtefRow}>
        Add Instructor Assignment
      </button>
    </>
  );
}
