import { useState } from "react";

const emptyForm = {
  courseId: "",
  title: "",
  type: "video",
  url: "",
  description: "",
};

const MaterialsPanel = ({ materials, courses, canManage, onCreate, statusMessage }) => {
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreate(form);
    setForm(emptyForm);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        {materials.map((material) => (
          <div
            key={material._id || material.id}
            className="rounded-[24px] border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-aura-gold">{material.type}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{material.title}</h3>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                {material.isPreview ? "Preview" : "Member only"}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{material.description}</p>
            <a
              href={material.url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex text-sm font-semibold text-aura-teal"
            >
              Open resource
            </a>
          </div>
        ))}
      </div>

      {canManage ? (
        <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-slate-950/40 p-5">
          <h3 className="font-display text-2xl text-white">Upload material</h3>
          <p className="mt-2 text-sm text-slate-300">Use URLs for videos, docs, or hosted assets.</p>
          <div className="mt-5 space-y-4">
            <select
              value={form.courseId}
              onChange={(event) => setForm((current) => ({ ...current, courseId: event.target.value }))}
              className="field-shell w-full"
              required
            >
              <option value="">Select course</option>
              {courses.map((course) => (
                <option key={course._id || course.id} value={course._id || course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Material title"
              className="field-shell w-full"
              required
            />
            <select
              value={form.type}
              onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))}
              className="field-shell w-full"
            >
              <option value="video">Video</option>
              <option value="document">Document</option>
              <option value="link">Link</option>
            </select>
            <input
              value={form.url}
              onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
              placeholder="https://..."
              className="field-shell w-full"
              required
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="What does this material cover?"
              rows="4"
              className="field-shell w-full"
            />
            {statusMessage ? <p className="text-sm text-aura-teal">{statusMessage}</p> : null}
            <button type="submit" className="primary-button w-full">
              Publish material
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default MaterialsPanel;
