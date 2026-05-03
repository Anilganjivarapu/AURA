const ReportPanel = ({ report }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
        <h3 className="font-display text-2xl text-white">Export-ready reports</h3>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          Use the browser print flow to save the current report as PDF. The backend summary endpoint powers this
          view, so exported reports stay aligned with live platform data.
        </p>
        <button type="button" className="primary-button mt-5 w-full no-print" onClick={handlePrint}>
          Export / Print PDF
        </button>
      </div>

      <div className="print-surface rounded-[28px] border border-white/10 bg-white/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-aura-gold">AURA platform report</p>
            <h3 className="mt-2 font-display text-3xl text-white">{report?.role || "Role"} summary</h3>
            <p className="mt-2 text-sm text-slate-300">Generated for {report?.generatedFor || "workspace user"}</p>
          </div>
          <p className="text-sm text-slate-400">
            {report?.generatedAt ? new Date(report.generatedAt).toLocaleString() : "Report not loaded"}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {Object.entries(report?.summary || {}).map(([label, value]) => (
            <div key={label} className="rounded-[20px] border border-white/10 bg-slate-950/35 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
              <p className="mt-3 text-2xl font-semibold text-aura-sand">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {(report?.highlights || []).map((item) => (
            <div key={item} className="rounded-[18px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-slate-950/35 text-slate-300">
              <tr>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Learners</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/5">
              {(report?.rows || []).map((row) => (
                <tr key={row.course}>
                  <td className="px-4 py-3 text-white">{row.course}</td>
                  <td className="px-4 py-3 text-slate-300">{row.status}</td>
                  <td className="px-4 py-3 text-slate-300">Rs {row.price}</td>
                  <td className="px-4 py-3 text-slate-300">{row.enrolledCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportPanel;
