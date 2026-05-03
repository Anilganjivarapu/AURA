import { useEffect, useState } from "react";

import AvatarCircle from "./AvatarCircle";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ProfilePanel = ({ user, onSave, message }) => {
  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || "",
    bio: user.bio || "",
    avatar: user.avatar || "",
  });

  useEffect(() => {
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      bio: user.bio || "",
      avatar: user.avatar || "",
    });
  }, [user]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const base64 = await fileToBase64(file);
    setForm((current) => ({ ...current, avatar: base64 }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSave(form);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
      <div className="glass-panel p-6">
        <div className="flex flex-col items-center text-center">
          <AvatarCircle user={{ ...user, avatar: form.avatar, name: form.name }} size="lg" />
          <h3 className="mt-4 font-display text-3xl text-white">{form.name || "Your profile"}</h3>
          <p className="mt-2 text-sm text-slate-400">{user.email}</p>
          <label className="secondary-button mt-5 cursor-pointer">
            Upload photo
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["name", "Full name"],
            ["phone", "Phone"],
          ].map(([key, placeholder]) => (
            <input
              key={key}
              value={form[key]}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              placeholder={placeholder}
              className="field-shell w-full"
            />
          ))}
        </div>
        <textarea
          value={form.bio}
          onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
          placeholder="Short bio"
          rows="5"
          className="field-shell mt-4 w-full"
        />
        {message ? <p className="mt-4 text-sm text-aura-teal">{message}</p> : null}
        <button type="submit" className="primary-button mt-5">
          Save profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePanel;
