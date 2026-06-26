import ResultCard from "./ResultCard";
import { round2, formatPercent3 } from "../lib/format";
import { tableClasses } from "../lib/componentStyles";

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
  return (
    <>
      <h2 className="mt-0 mb-1 text-center text-xl font-bold">FTEF</h2>

      <div className="overflow-x-auto">
        <table className="mt-2 w-full table-auto border-collapse">
          <caption className="sr-only">
            Faculty load assignments and calculated FTEF percentages
          </caption>
          <thead>
            <tr>
              <th className={tableClasses.header} scope="col">
                Workload Factor
              </th>
              <th className={tableClasses.header} scope="col">
                Catalog Hours
              </th>
              <th className={tableClasses.header} scope="col">
                Class FTEF %
              </th>
              <th className={tableClasses.header} scope="col">
                Class Contact Hours
              </th>
              <th className={tableClasses.header} scope="col">
                Instructor Assigned Hours
              </th>
              <th className={tableClasses.header} scope="col">
                % of Assignment
              </th>
              <th className={tableClasses.header} scope="col">
                Instructor FTEF%
              </th>
              <th className={tableClasses.header} scope="col">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {ftefRows.map((row, index) => {
              const {
                rowCatalogHours,
                rowClassContactHours,
                ftefPercent,
                assignPercent,
                instructorFtef,
              } = calculateFtefRow(row, catalogHours, classContactHours);

              return (
                <tr key={index}>
                  <td className={tableClasses.cell}>
                    <input
                      className={tableClasses.input}
                      type="number"
                      min={0}
                      aria-label={`Workload factor, assignment ${index + 1}`}
                      value={row.workloadFactor}
                      onChange={(event) =>
                        updateFtefRow(
                          index,
                          "workloadFactor",
                          event.target.value,
                        )
                      }
                    />
                  </td>

                  <td className={tableClasses.cell}>
                    <input
                      className={tableClasses.input}
                      type="number"
                      min={0}
                      aria-label={`Catalog hours, assignment ${index + 1}`}
                      value={rowCatalogHours}
                      onChange={(event) =>
                        updateFtefRow(index, "catalogHours", event.target.value)
                      }
                    />
                  </td>
                  <td className={tableClasses.cell}>
                    {formatPercent3(ftefPercent)}
                  </td>
                  <td className={tableClasses.cell}>
                    <input
                      className={tableClasses.input}
                      type="number"
                      min={0}
                      aria-label={`Class contact hours, assignment ${index + 1}`}
                      value={rowClassContactHours}
                      onChange={(event) =>
                        updateFtefRow(
                          index,
                          "classContactHours",
                          event.target.value,
                        )
                      }
                    />
                  </td>

                  <td className={tableClasses.cell}>
                    <input
                      className={tableClasses.input}
                      type="number"
                      min={0}
                      aria-label={`Instructor assigned hours, assignment ${index + 1}`}
                      value={row.instructorAssignedHours}
                      onChange={(event) =>
                        updateFtefRow(
                          index,
                          "instructorAssignedHours",
                          event.target.value,
                        )
                      }
                    />
                  </td>

                  <td className={tableClasses.cell}>
                    {round2(assignPercent * 100)}%
                  </td>
                  <td className={tableClasses.cell}>
                    {formatPercent3(instructorFtef)}
                  </td>

                  <td className={tableClasses.cell}>
                    <button
                      className={tableClasses.actionButton}
                      type="button"
                      aria-label={`Delete assignment ${index + 1}`}
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
        <ResultCard
          title="Total FTEF%"
          value={formatPercent3(totalFtef)}
          color="success"
        />
        <button
          className={tableClasses.addButton}
          type="button"
          onClick={addFtefRow}
        >
          Add Assignment
        </button>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Total instructor FTEF: {formatPercent3(totalFtef)}.
      </p>
    </>
  );
}
