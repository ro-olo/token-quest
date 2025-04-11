import React, { useState, useEffect } from 'react';
import { getJournalEntries, saveJournalEntry, deleteJournalEntry } from '../utils/dataUtils';
import { formatDate } from '../utils/dataUtils';
import JournalModal from '../components/journal/JournalModal';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  
  // Load journal entries on component mount
  useEffect(() => {
    loadEntries();
  }, []);

  // Load journal entries from localStorage
  const loadEntries = () => {
    const loadedEntries = getJournalEntries();
    // Sort entries by date (newest first)
    loadedEntries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setEntries(loadedEntries);
  };
  
  // Open modal to add new entry
  const handleAddEntry = () => {
    setCurrentEntry(null);
    setModalOpen(true);
  };
  
  // Open modal to edit existing entry
  const handleEditEntry = (entry) => {
    setCurrentEntry(entry);
    setModalOpen(true);
  };
  
  // Handle entry deletion
  const handleDeleteEntry = (entryId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa voce del diario?')) {
      deleteJournalEntry(entryId);
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryId));
    }
  };
  
  // Save entry from modal
  const handleSaveEntry = (entryData) => {
    const savedEntry = saveJournalEntry(entryData);
    
    if (currentEntry) {
      // Update existing entry
      setEntries(prevEntries => prevEntries.map(
        e => e.id === savedEntry.id ? savedEntry : e
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } else {
      // Add new entry
      setEntries(prevEntries => [savedEntry, ...prevEntries]);
    }
    
    setModalOpen(false);
  };
  
  return (
    <div className="journal-page">
      <div className="container">
        <div className="journal-header">
          <h2>Diario dell'Avventura</h2>
          <button onClick={handleAddEntry} className="btn btn-primary">
            <i className="fas fa-feather"></i> Nuova Voce
          </button>
        </div>
        
        <div className="journal-explanation">
          <p>Tieni traccia del tuo viaggio, delle tue riflessioni e dei tuoi progressi in questo diario magico.</p>
        </div>
        
        <div className="journal-entries">
          {entries.length > 0 ? (
            entries.map(entry => (
              <div key={entry.id} className="journal-entry">
                <div className="journal-entry-header">
                  <h3 className="journal-entry-title">{entry.title}</h3>
                  <div className="journal-entry-date">{formatDate(entry.createdAt)}</div>
                </div>
                
                <div className="journal-entry-content">
                  {entry.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="mood-tag">
                  <i className={`fas ${getMoodIcon(entry.mood)}`}></i> {getMoodLabel(entry.mood)}
                </div>
                
                <div className="journal-entry-footer">
                  <button 
                    onClick={() => handleEditEntry(entry)}
                    className="btn btn-secondary btn-sm"
                  >
                    <i className="fas fa-edit"></i> Modifica
                  </button>
                  <button 
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="btn btn-danger btn-sm"
                  >
                    <i className="fas fa-trash"></i> Elimina
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-journal">
              <div className="empty-icon">
                <i className="fas fa-book-open"></i>
              </div>
              <p className="empty-text">Il tuo diario è vuoto. Inizia a scrivere per registrare la tua avventura!</p>
              <button onClick={handleAddEntry} className="btn btn-primary">
                Scrivi la prima pagina
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Journal Modal - for adding/editing entries */}
      {modalOpen && (
        <JournalModal 
          entry={currentEntry}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveEntry}
        />
      )}
    </div>
  );
};

// Helper functions for mood icons and labels
const getMoodIcon = (mood) => {
  switch (mood) {
    case 'great':
      return 'fa-laugh-beam';
    case 'good':
      return 'fa-smile';
    case 'neutral':
      return 'fa-meh';
    case 'bad':
      return 'fa-frown';
    case 'awful':
      return 'fa-sad-tear';
    default:
      return 'fa-meh';
  }
};

const getMoodLabel = (mood) => {
  switch (mood) {
    case 'great':
      return 'Eccellente';
    case 'good':
      return 'Buono';
    case 'neutral':
      return 'Neutrale';
    case 'bad':
      return 'Non buono';
    case 'awful':
      return 'Terribile';
    default:
      return 'Neutrale';
  }
};

export default Journal;
