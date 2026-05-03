import { useState } from "react";

const initialForm = {
  title: "",
  description: "",
  price: 0,
  image: "",
  duration: "8 weeks",
};

const CreateCourseForm = ({ onCreate, statusMessage }) => {
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreate({
      ...form,
      price: Number(form.price),
    });
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5">
      <h3 className="font-display text-2xl text-white">Create course</h3>
      <p className="mt-2 text-sm text-slate-300">Admin and staff can publish new premium learning tracks here.</p>
      <div className="mt-5 space-y-4">
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          placeholder="Course title"
          className="field-shell w-full"
          required
        />
        <textarea
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          placeholder="Describe the learning outcome"
          rows="4"
          className="field-shell w-full"
          required
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
            type="number"
            min="0"
            placeholder="Price"
            className="field-shell w-full"
          />
          <input
            value={form.duration}
            onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
            placeholder="Duration"
            className="field-shell w-full"
          />
          <input
            value={form.image}
            onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
            placeholder="Course image URL"
            className="field-shell w-full md:col-span-2"
          />
        </div>
        {statusMessage ? <p className="text-sm text-aura-teal">{statusMessage}</p> : null}
        <button type="submit" className="primary-button w-full">
          Add course
        </button>
      </div>
    </form>
  );
};

export default CreateCourseForm;
