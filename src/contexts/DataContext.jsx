import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==================== PROFILE ====================
  
  async function getProfile() {
    try {
      const docRef = doc(db, 'settings', 'profile');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile(data);
        return data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async function updateProfile(data) {
    try {
      const docRef = doc(db, 'settings', 'profile');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          ...data,
          updatedAt: serverTimestamp()
        });
      } else {
        await setDoc(docRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      setProfile({ ...profile, ...data });
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== BLOGS ====================
  
  async function getBlogs() {
    try {
      const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const blogsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBlogs(blogsData);
      return blogsData;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Return empty array but don't fail
      setBlogs([]);
      return [];
    }
  }

  async function getBlogById(id) {
    try {
      const docRef = doc(db, 'blogs', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching blog:', error);
      return null;
    }
  }

  async function addBlog(data) {
    try {
      const docRef = await addDoc(collection(db, 'blogs'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      await getBlogs();
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function updateBlog(id, data) {
    try {
      const docRef = doc(db, 'blogs', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      await getBlogs();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function deleteBlog(id) {
    try {
      await deleteDoc(doc(db, 'blogs', id));
      await getBlogs();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== PROJECTS ====================
  
  async function getProjects() {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      return projectsData;
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
      return [];
    }
  }

  async function getProjectById(id) {
    try {
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching project:', error);
      return null;
    }
  }

  async function addProject(data) {
    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      await getProjects();
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function updateProject(id, data) {
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      await getProjects();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function deleteProject(id) {
    try {
      await deleteDoc(doc(db, 'projects', id));
      await getProjects();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== CATEGORIES ====================
  
  async function getCategories() {
    try {
      const q = query(collection(db, 'categories'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
      return categoriesData;
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      return [];
    }
  }

  async function addCategory(categoryData) {
    try {
      const data = typeof categoryData === 'string' 
        ? { name: categoryData, type: 'blog' }
        : categoryData;
        
      const docRef = await addDoc(collection(db, 'categories'), {
        name: data.name,
        type: data.type || 'blog',
        createdAt: serverTimestamp()
      });
      await getCategories();
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function deleteCategory(id) {
    try {
      await deleteDoc(doc(db, 'categories', id));
      await getCategories();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== FILE UPLOADS ====================
  
  async function uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }
  }

  async function deleteFile(path) {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ==================== INITIAL LOAD ====================
  
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        await Promise.all([
          getProfile(),
          getBlogs(),
          getProjects(),
          getCategories()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const value = {
    // State
    profile,
    blogs,
    projects,
    categories,
    loading,
    
    // Profile methods
    getProfile,
    updateProfile,
    
    // Blog methods
    getBlogs,
    getBlogById,
    addBlog,
    updateBlog,
    deleteBlog,
    
    // Project methods
    getProjects,
    getProjectById,
    addProject,
    updateProject,
    deleteProject,
    
    // Category methods
    getCategories,
    addCategory,
    deleteCategory,
    
    // File methods
    uploadFile,
    deleteFile
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
