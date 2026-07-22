import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useData } from '../../contexts/DataContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const EMPTY = { title: '', subtitle: '', publication: '', link: '', imageURL: '', order: 0 };

export default function AdminBylines() {
  const { bylines, addByline, updateByline, deleteByline, uploadFile } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 2600); };
  const openNew = () => { setForm({ ...EMPTY, order: bylines.length }); setEditing({}); };
  const openEdit = (item) => { setForm({ ...EMPTY, ...item }); setEditing(item); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadFile(file, `bylines/${Date.now()}-${file.name}`);
    setUploading(false);
    if (res.success) setForm(f => ({ ...f, imageURL: res.url }));
    else notify(res.error || 'Upload failed.', false);
  }

  async function save() {
    if (!form.title) return notify('Title is required.', false);
    if (!form.link) return notify('Add the link to the published piece.', false);
    setSaving(true);
    const payload = { ...form, order: Number(form.order) || 0 };
    const res = editing?.id ? await updateByline(editing.id, payload) : await addByline(payload);
    setSaving(false);
    if (res.success) { notify('Saved.'); setEditing(null); } else notify(res.error || 'Save failed.', false);
  }
  async function remove(id) {
    if (!window.confirm('Delete this byline?')) return;
    const res = await deleteByline(id);
    notify(res.success ? 'Deleted.' : 'Delete failed.', res.success);
  }

  return (
    <AdminLayout
      title="Published Bylines"
      subtitle="Print and online articles. Each card links to the published work."
      action={!editing && <button className="a-btn primary" onClick={openNew}><Plus size={18} /> Add byline</button>}
    >
      {toast && <div className={`toast ${toast.ok ? 'ok' : 'err'}`}>{toast.msg}</div>}

      {editing ? (
        <div className="a-form">
          <h2>{editing.id ? 'Edit byline' : 'New byline'}</h2>
          <div className="field">
            <label>Cover image</label>
            <div className="uploader">
              <img className="preview" src={form.imageURL || 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'} alt="" />
              <label className="file-label">{uploading ? 'Uploading…' : 'Choose image'}<input type="file" accept="image/*" onChange={onFile} /></label>
            </div>
          </div>
          <div className="field"><label>Title</label><input value={form.title} onChange={set('title')} placeholder="The 400 homes stuck in a filing cabinet" /></div>
          <div className="field"><label>Subtitle</label><textarea value={form.subtitle} onChange={set('subtitle')} placeholder="A short line describing the piece." /></div>
          <div className="field-row">
            <div className="field"><label>Publication</label><input value={form.publication} onChange={set('publication')} placeholder="City Beat" /></div>
            <div className="field"><label>Order</label><input type="number" value={form.order} onChange={set('order')} /><div className="hint">Lower shows first.</div></div>
          </div>
          <div className="field"><label>Link to article</label><input value={form.link} onChange={set('link')} placeholder="https://…" /></div>
          <div className="form-actions">
            <button className="a-btn primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save byline'}</button>
            <button className="a-btn ghost" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
      ) : bylines.length ? (
        <div className="a-list">
          {bylines.map((item) => (
            <div className="a-card" key={item.id}>
              {item.imageURL ? <img className="thumb" src={item.imageURL} alt="" /> : <div className="thumb" />}
              <div className="a-card-body">
                {item.publication && <div className="meta">{item.publication}</div>}
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
              <div className="a-card-actions">
                <button className="icon-btn edit" onClick={() => openEdit(item)}><Pencil size={16} /></button>
                <button className="icon-btn del" onClick={() => remove(item.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="a-empty"><h3>No bylines yet</h3><p>Add your first published article.</p></div>
      )}
    </AdminLayout>
  );
}
