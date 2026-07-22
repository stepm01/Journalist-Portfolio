import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useData } from '../../contexts/DataContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = { title: '', description: '', link: '', views: '', thumbnailURL: '', order: 0 };

export default function AdminReels() {
  const { reels, addReel, updateReel, deleteReel, uploadFile } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 2600); };
  const openNew = () => { setForm({ ...EMPTY, order: reels.length }); setEditing({}); };
  const openEdit = (item) => { setForm({ ...EMPTY, ...item }); setEditing(item); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadFile(file, `reels/${Date.now()}-${file.name}`);
    setUploading(false);
    if (res.success) setForm(f => ({ ...f, thumbnailURL: res.url }));
    else notify(res.error || 'Upload failed.', false);
  }

  async function save() {
    if (!form.title) return notify('Title is required.', false);
    if (!form.link) return notify('Add the link to the reel.', false);
    setSaving(true);
    const payload = { ...form, order: Number(form.order) || 0 };
    const res = editing?.id ? await updateReel(editing.id, payload) : await addReel(payload);
    setSaving(false);
    if (res.success) { notify('Saved.'); setEditing(null); } else notify(res.error || 'Save failed.', false);
  }
  async function remove(id) {
    if (!window.confirm('Delete this reel?')) return;
    const res = await deleteReel(id);
    notify(res.success ? 'Deleted.' : 'Delete failed.', res.success);
  }

  return (
    <AdminLayout
      title="Social Reels"
      subtitle="Short-form video work. Each card links out to Instagram, TikTok, or YouTube."
      action={!editing && <button className="a-btn primary" onClick={openNew}><Plus size={18} /> Add reel</button>}
    >
      {toast && <div className={`toast ${toast.ok ? 'ok' : 'err'}`}>{toast.msg}</div>}

      {editing ? (
        <div className="a-form">
          <h2>{editing.id ? 'Edit reel' : 'New reel'}</h2>
          <div className="field">
            <label>Thumbnail (9:16 works best)</label>
            <div className="uploader">
              <img className="preview tall" src={form.thumbnailURL || 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'} alt="" />
              <label className="file-label">{uploading ? 'Uploading…' : 'Choose image'}<input type="file" accept="image/*" onChange={onFile} /></label>
            </div>
          </div>
          <div className="field"><label>Title</label><input value={form.title} onChange={set('title')} placeholder="The permit backlog, explained" /></div>
          <div className="field"><label>Short description</label><textarea value={form.description} onChange={set('description')} placeholder="One line about the reel." /></div>
          <div className="field-row">
            <div className="field"><label>Link</label><input value={form.link} onChange={set('link')} placeholder="https://instagram.com/reel/…" /></div>
            <div className="field"><label>Views (optional)</label><input value={form.views} onChange={set('views')} placeholder="240k" /></div>
          </div>
          <div className="field"><label>Order</label><input type="number" value={form.order} onChange={set('order')} /><div className="hint">Lower shows first.</div></div>
          <div className="form-actions">
            <button className="a-btn primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save reel'}</button>
            <button className="a-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      ) : reels.length ? (
        <div className="a-list">
          {reels.map((item) => (
            <div className="a-card" key={item.id}>
              {item.thumbnailURL
                ? <img className="thumb tall" src={item.thumbnailURL} alt="" />
                : <div className="thumb tall" />}
              <div className="a-card-body">
                {item.views && <div className="meta">▶ {item.views}</div>}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="a-card-actions">
                <button className="icon-btn edit" onClick={() => openEdit(item)}><Pencil size={16} /></button>
                <button className="icon-btn del" onClick={() => remove(item.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="a-empty"><h3>No reels yet</h3><p>Add your first short-form video.</p></div>
      )}
    </AdminLayout>
  );
}
