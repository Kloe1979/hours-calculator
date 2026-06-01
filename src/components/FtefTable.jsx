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
  return (
    <>
        <h2>Instructor FTEF</h2>

        <table className="ftef-table">
        <thead>
            <tr>
            <th>Workload Factor</th>
            <th>Catalog Hours</th>
            <th>FTEF %</th>
            <th>Class Contact Hours</th>
            <th>Instructor Assigned Hours</th>
            <th>% of Assignment</th>
            <th>Instructor FTEF</th>
            <th>Actions</th>
            </tr>
        </thead>

        <tbody>
            {ftefRows.map((row, index) => {
            const ftefPercent = row.workloadFactor > 0 ? catalogHours / row.workloadFactor : 0;
            const assignPercent = maxHours > 0 ? row.instructorAssignedHours / maxHours : 0;
            const instructorFtef = ftefPercent * assignPercent;

            return (
                <tr key={index}>
                <td>
                    <input
                    type="number"
                    value={row.workloadFactor}
                    onChange={(event) =>
                        updateFtefRow(index, "workloadFactor", Number(event.target.value) || 0)
                    }
                    />
                </td>

                <td>{catalogHours ?? ""}</td>
                <td>{round2(ftefPercent * 100)}%</td>
                <td>{maxHours ?? ""}</td>

                <td>
                    <input
                    type="number"
                    value={row.instructorAssignedHours}
                    onChange={(event) =>
                        updateFtefRow(index, "instructorAssignedHours", Number(event.target.value) || 0)
                    }
                    />
                </td>

                <td>{round2(assignPercent * 100)}%</td>
                <td>{round2(instructorFtef * 100)}%</td>

                <td>
                    <button
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

        <button type="button" onClick={addFtefRow}>
        Add Instructor Assignment
        </button>
        </>
    );
}