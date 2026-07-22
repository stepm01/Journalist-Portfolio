import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useData } from '../../contexts/DataContext';
import { Plus, Trash2 } from 'lucide-react';

const toText = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');
const toArr = (str) => str.split(',').map(s => s.trim()).filter(Boolean);

export default function AdminSettings() {
  const { profile, updateProfile, uploadFile } = useData();
  const [form, setForm] = useState({
    name: '', tagline: '', bio: '', about: '',
    focusAreas: '', publications: '', portraitURL: '', email: '', cvURL: ''
  });
  const [socials, setSocials] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || '',
        tagline: profile.tagline || '',
        bio: profile.bio || '',
        about: profile.about || '',
        focusAreas: toText(profile.focusAreas),
        publications: toText(profile.publications),
        portraitURL: profile.portraitURL || '',
        email: profile.email || '',
        cvURL: profile.cvURL || ''
      });
      setSocials(profile.socials || []);
    }
  }, [profile]);

  const notify = (msg, ok = true) => { setToast({ msg, ok }); setTimeout(() => setToast(null), 2600); };
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const res = await uploadFile(file, `profile/portrait-${Date.now()}-${file.name}`);
    setUploading(false);
    if (res.success) setForm(f => ({ ...f, portraitURL: res.url }));
    else notify(res.error || 'Upload failed.', false);
  }

  const setSocial = (i, k) => (e) => setSocials(s => s.map((row, idx) => idx === i ? { ...row, [k]: e.target.value } : row));
  const addSocial = () => setSocials(s => [...s, { label: '', url: '' }]);
  const removeSocial = (i) => setSocials(s => s.filter((_, idx) => idx !== i));

  async function save() {
    setSaving(true);
    const payload = {
      ...form,
      focusAreas: toArr(form.focusAreas),
      publications: toArr(form.publications),
      socials: socials.filter(s => s.label && s.url)
    };
    const res = await updateProfile(payload);
    setSaving(false);
    notify(res.success ? 'Profile saved.' : (res.error || 'Save failed.'), res.success);
  }

  return (
    <AdminLayout title="Settings" subtitle="This drives your hero, about section, and footer.">
      {toast && <div className={`toast ${toast.ok ? 'ok' : 'err'}`}>{toast.msg}</div>}

      <div className="a-form" style={{ marginBottom: 20 }}>
        <h2>Identity</h2>
        <div className="field">
          <label>Portrait</label>
          <div className="uploader">
            <img className="preview" src={form.portraitURL || 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22/>'} alt="" />
            <label className="file-label">{uploading ? 'Uploading…' : 'Choose image'}<input type="file" accept="image/*" onChange={onFile} /></label>
          </div>
        </div>
        <div className="field-row">
          <div className="field"><label>Full name</label><input value={form.name} onChange={set('name')} placeholder="Anna Reyes" /></div>
          <div className="field"><label>Email</label><input value={form.email} onChange={set('email')} placeholder="anna@example.com" /></div>
        </div>
        <div className="field">
          <label>Hero tagline</label>
          <input value={form.tagline} onChange={set('tagline')} placeholder="reports in *motion*." />
          <div className="hint">Wrap a word in *asterisks* to accent it in red.</div>
        </div>
        <div className="field"><label>Hero subtitle</label><textarea value={form.bio} onChange={set('bio')} placeholder="One or two sentences under your name." /></div>
      </div>

      <div className="a-form" style={{ marginBottom: 20 }}>
        <h2>About</h2>
        <div className="field">
          <label>About text</label>
          <textarea value={form.about} onChange={set('about')} style={{ minHeight: 160 }}
            placeholder={'First line is the big lead statement.\nEach new line becomes a paragraph in the body.'} />
          <div className="hint">First line = the large lead. Following lines = body paragraphs.</div>
        </div>
        <div className="field"><label>Focus areas</label><input value={form.focusAreas} onChange={set('focusAreas')} placeholder="Investigative, Local gov, Short-form video" /><div className="hint">Comma-separated tags.</div></div>
        <div className="field"><label>Publications (hero marquee)</label><input value={form.publications} onChange={set('publications')} placeholder="City Beat, The Dispatch, Reel Report" /><div className="hint">Comma-separated names that scroll across the hero.</div></div>
      </div>

      <div className="a-form">
        <h2>Contact &amp; links</h2>
        <div className="field"><label>CV / résumé link</label><input value={form.cvURL} onChange={set('cvURL')} placeholder="https://… (link to a hosted PDF)" /></div>
        <div className="field"><label>Social links</label>
          {socials.map((s, i) => (
            <div className="field-row" key={i} style={{ marginBottom: 10, alignItems: 'end' }}>
              <input value={s.label} onChange={setSocial(i, 'label')} placeholder="Instagram / Reels" />
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={s.url} onChange={setSocial(i, 'url')} placeholder="https://…" />
                <button className="icon-btn del" onClick={() => removeSocial(i)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          <button className="a-btn ghost" onClick={addSocial} style={{ marginTop: 6 }}><Plus size={16} /> Add link</button>
        </div>
        <div className="form-actions">
          <button className="a-btn primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save all changes'}</button>
        </div>
      </div>
    </AdminLayout>
  );
}
