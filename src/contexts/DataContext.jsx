import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

const DataContext = createContext();

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}

// sort helper: honor an `order` number, fall back to createdAt (newest last)
function byOrder(a, b) {
  const ao = a.order ?? 9999;
  const bo = b.order ?? 9999;
  if (ao !== bo) return ao - bo;
  const at = a.createdAt?.seconds ?? 0;
  const bt = b.createdAt?.seconds ?? 0;
  return at - bt;
}

export function DataProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [experience, setExperience] = useState([]);
  const [reels, setReels] = useState([]);
  const [bylines, setBylines] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- PROFILE (single doc: settings/profile) ----------------
  async function getProfile() {
    try {
      const snap = await getDoc(doc(db, 'settings', 'profile'));
      if (snap.exists()) { setProfile(snap.data()); return snap.data(); }
      return null;
    } catch (e) { console.error('getProfile', e); return null; }
  }

  async function updateProfile(data) {
    try {
      const refDoc = doc(db, 'settings', 'profile');
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        await updateDoc(refDoc, { ...data, updatedAt: serverTimestamp() });
      } else {
        await setDoc(refDoc, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      }
      setProfile(prev => ({ ...prev, ...data }));
      return { success: true };
    } catch (e) { console.error('updateProfile', e); return { success: false, error: e.message }; }
  }

  // ---------------- Generic collection factory ----------------
  function makeCollection(name, setState) {
    async function getAll() {
      try {
        const qs = await getDocs(collection(db, name));
        const items = qs.docs.map(d => ({ id: d.id, ...d.data() })).sort(byOrder);
        setState(items);
        return items;
      } catch (e) { console.error(`get ${name}`, e); setState([]); return []; }
    }
    async function add(data) {
      try {
        const r = await addDoc(collection(db, name), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        await getAll();
        return { success: true, id: r.id };
      } catch (e) { return { success: false, error: e.message }; }
    }
    async function update(id, data) {
      try {
        await updateDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() });
        await getAll();
        return { success: true };
      } catch (e) { return { success: false, error: e.message }; }
    }
    async function remove(id) {
      try {
        await deleteDoc(doc(db, name, id));
        await getAll();
        return { success: true };
      } catch (e) { return { success: false, error: e.message }; }
    }
    return { getAll, add, update, remove };
  }

  const exp = makeCollection('experience', setExperience);
  const rl = makeCollection('reels', setReels);
  const by = makeCollection('bylines', setBylines);

  // ---------------- File uploads ----------------
  async function uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path);
      const snap = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snap.ref);
      return { success: true, url };
    } catch (e) { console.error('upload', e); return { success: false, error: e.message }; }
  }
  async function deleteFile(path) {
    try { await deleteObject(ref(storage, path)); return { success: true }; }
    catch (e) { return { success: false, error: e.message }; }
  }

  // ---------------- Initial load ----------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await Promise.all([getProfile(), exp.getAll(), rl.getAll(), by.getAll()]);
      } catch (e) { console.error('initial load', e); }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    profile, experience, reels, bylines, loading,
    getProfile, updateProfile,
    getExperience: exp.getAll, addExperience: exp.add, updateExperience: exp.update, deleteExperience: exp.remove,
    getReels: rl.getAll, addReel: rl.add, updateReel: rl.update, deleteReel: rl.remove,
    getBylines: by.getAll, addByline: by.add, updateByline: by.update, deleteByline: by.remove,
    uploadFile, deleteFile
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
