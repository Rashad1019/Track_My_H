import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ApplicationList from './components/ApplicationList';
import './App.css';

const STORAGE_KEY = 'job-tracker-applications';

function App() {
  const [applications, setApplications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever applications change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, [applications]);

  const handleAddApplication = (newApp) => {
    setApplications(prev => [newApp, ...prev]);
  };

  const handleUpdateApplication = (updatedApp) => {
    setApplications(prev =>
      prev.map(app => app.id === updatedApp.id ? updatedApp : app)
    );
  };

  const handleDeleteApplication = (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      setApplications(prev => prev.filter(app => app.id !== id));
    }
  };

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <InputSection onAddApplication={handleAddApplication} />
        <ApplicationList
          applications={applications}
          onUpdate={handleUpdateApplication}
          onDelete={handleDeleteApplication}
        />
      </main>
      <footer className="footer">
        <p>Your data is saved locally on this device 🔒</p>
      </footer>
    </div>
  );
}

export default App;
