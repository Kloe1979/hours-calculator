import ResultCard from "./ResultCard";

function round2(value) {
  return Math.round(value * 100) / 100;
}

function formatPercent3(value) {
  return `${(value * 100).toFixed(3)}%`;
}

export default function FtefTable({
  ftefRows,
  updateFtefRow,
  deleteFtefRow,
  addFtefRow,
  calculateFtefRow,
  catalogHours,
  classContactHours,
  totalFtef,
}) {
  const cellClass = "border border-gray-300 p-2 text-center align-middle";
  const headerClass = `${cellClass} bg-gray-100 text-sm font-semibold`;
  const inputClass = "w-full max-w-[140px] rounded-md border border-gray-300 px-2 py-2 text-sm text-center";
  const buttonClass =
    "mt-3 cursor-pointer rounded-lg border-0 bg-[#3A6F9E] px-3 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500";
  const addButtonClass =
    "min-h-[50px] cursor-pointer rounded-[7px] border border-[#2f5f88] bg-gradient-to-b from-[#477fac] to-[#3A6F9E] px-3 py-1 font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_2px_4px_rgba(0,0,0,0.14)] transition hover:from-[#5289b7] hover:to-[#3f78aa] active:translate-y-px active:shadow-[inset_0_2px_3px_rgba(0,0,0,0.16)]";

  return (
    <>
      <h2 className="mt-0 mb-1 text-center text-xl font-bold">FTEF</h2>

      <div className="overflow-x-auto">
        <table className="mt-2 w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className={headerClass}>Workload Factor</th>
              <th className={headerClass}>Catalog Hours</th>
              <th className={headerClass}>Class FTEF %</th>
              <th className={headerClass}>Class Contact Hours</th>
              <th className={headerClass}>Instructor Assigned Hours</th>
              <th className={headerClass}>% of Assignment</th>
              <th className={headerClass}>Instructor FTEF%</th>
              <th className={headerClass}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {ftefRows.map((row, index) => {
              const { ftefPercent, assignPercent, instructorFtef } =
                calculateFtefRow(row, catalogHours, classContactHours);
              const rowCatalogHours =
                row.catalogHours === "" ? catalogHours : row.catalogHours;
              const rowClassContactHours =
                row.classContactHours === ""
                  ? classContactHours
                  : row.classContactHours;

              return (
                <tr key={index}>
                  <td className={cellClass}>
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      value={row.workloadFactor}
                      onChange={(event) =>
                        updateFtefRow(
                          index,
                          "workloadFactor",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td className={cellClass}>
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      value={rowCatalogHours}
                      onChange={(event) =>
                        updateFtefRow(index, "catalogHours", event.target.value)
                      }
                    />
                  </td>
                  <td className={cellClass}>{formatPercent3(ftefPercent)}</td>
                  <td className={cellClass}>
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      value={rowClassContactHours}
                      onChange={(event) =>
                        updateFtefRow(
                          index,
                          "classContactHours",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td className={cellClass}>
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      value={row.instructorAssignedHours}
                      onChange={(event) =>
                        updateFtefRow(
                          index,
                          "instructorAssignedHours",
                          event.target.value
                        )
                      }
                    />
                  </td>

                  <td className={cellClass}>{round2(assignPercent * 100)}%</td>
                  <td className={cellClass}>{formatPercent3(instructorFtef)}</td>

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

      <div className="mt-2 grid justify-end gap-2 [grid-template-columns:repeat(auto-fit,minmax(200px,210px))]">
        <ResultCard title="Total FTEF%" value={formatPercent3(totalFtef)} color="success" />
        <button className={addButtonClass} type="button" onClick={addFtefRow}>
          Add Assignment
        </button>
      </div>
    </>
  );
}
