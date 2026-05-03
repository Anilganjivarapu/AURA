import { useState } from "react";

const AdminUsersPanel = ({ users, onUpdate, onDelete }) => {
  const [busyId, setBusyId] = useState("");

  const handleRoleChange = async (user, role) => {
    setBusyId(user.id || user._id);
    await onUpdate(user.id || user._id, { role });
    setBusyId("");
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id || user._id} className="glass-panel p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">{user.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{user.email}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                {user.staffId ? `Staff ID: ${user.staffId}` : user.role}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                className="field-shell"
                value={user.role}
                onChange={(event) => handleRoleChange(user, event.target.value)}
                disabled={busyId === (user.id || user._id)}
              >
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <button type="button" className="secondary-button" onClick={() => onDelete(user.id || user._id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminUsersPanel;
