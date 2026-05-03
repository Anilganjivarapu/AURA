import { useEffect, useState } from "react";

const HomeContentPanel = ({ content, canEdit, onSave }) => {
  const [form, setForm] = useState(content);

  useEffect(() => {
    setForm(content || {});
  }, [content]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="glass-panel overflow-hidden p-0">
        {form.homeImage ? <img src={form.homeImage} alt="AURA home" className="h-64 w-full object-cover" /> : null}
        <div className="p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-aura-gold">Home</p>
          <h2 className="mt-3 font-display text-4xl text-white">{form.homeTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-300">{form.homeSubtitle}</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h3 className="font-display text-2xl text-white">{canEdit ? "Edit homepage" : "Homepage content"}</h3>
        {canEdit ? (
          <>
            <input
              value={form.homeTitle || ""}
              onChange={(event) => setForm((current) => ({ ...current, homeTitle: event.target.value }))}
              placeholder="Home title"
              className="field-shell mt-5 w-full"
            />
            <textarea
              value={form.homeSubtitle || ""}
              onChange={(event) => setForm((current) => ({ ...current, homeSubtitle: event.target.value }))}
              placeholder="Home subtitle"
              rows="5"
              className="field-shell mt-4 w-full"
            />
            <input
              value={form.homeImage || ""}
              onChange={(event) => setForm((current) => ({ ...current, homeImage: event.target.value }))}
              placeholder="Image URL"
              className="field-shell mt-4 w-full"
            />
            <button type="button" className="primary-button mt-5" onClick={() => onSave(form)}>
              Save homepage
            </button>
          </>
        ) : (
          <p className="mt-4 text-sm leading-7 text-slate-300">
            This section is controlled by the admin and shown across the workspace.
          </p>
        )}
      </div>
    </div>
  );
};

export default HomeContentPanel;
