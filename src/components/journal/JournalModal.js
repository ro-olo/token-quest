import React, { useState, useEffect } from 'react';

const JournalModal = ({ entry, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'neutral',
  });

  // Initialize form with entry data if editing
  useEffect(() => {
    if (entry) {
      setFormData({
        ...entry,
        mood: entry.mood || 'neutral',
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // Mood options for the journal
  const moodOptions = [
    { id: 'great', label: 'Eccellente', icon: 'fa-laugh-beam' },
    { id: 'good', label: 'Buono', icon: 'fa-smile' },
    { id: 'neutral', label: 'Neutrale', icon: 'fa-meh' },
    { id: 'bad', label: 'Non buono', icon: 'fa-frown' },
    { id: 'awful', label: 'Terribile', icon: 'fa-sad-tear' },
  ];

  return (
    <div className="modal-overlay open">
      <div className="modal open">
        <div className="modal-header">
          <h2 className="modal-title">
            {entry ? 'Modifica Voce' : 'Nuova Pagina del Diario'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Titolo</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Es. Un giorno di grandi conquiste"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Contenuto</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Racconta la tua avventura di oggi..."
                required
                rows={8}
              />
            </div>

            <div className="form-group">
              <label>Il tuo stato d'animo</label>
              <div className="mood-selector">
                {moodOptions.map(mood => (
                  <div
                    key={mood.id}
                    className={`mood-option ${formData.mood === mood.id ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, mood: mood.id })}
                  >
                    <i className={`fas ${mood.icon}`}></i>
                    <span>{mood.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Annulla
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            {entry ? 'Salva Modifiche' : 'Aggiungi al Diario'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalModal;
