import React, { useState, useEffect } from 'react';

const MissionModal = ({ mission, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    energyReward: 1,
  });

  // Initialize form with mission data if editing
  useEffect(() => {
    if (mission) {
      setFormData({
        ...mission,
        energyReward: mission.energyReward || 1,
      });
    }
  }, [mission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseInt(value, 10) || 0,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay open">
      <div className="modal open">
        <div className="modal-header">
          <h2 className="modal-title">
            {mission ? 'Modifica Missione' : 'Nuova Missione'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Titolo della Missione</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Es. Conquista della Montagna di Libri"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrizione</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Es. Studiare per 2 ore di matematica"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="energyReward">Ricompensa in Energia</label>
              <input
                type="number"
                id="energyReward"
                name="energyReward"
                min="1"
                max="10"
                value={formData.energyReward}
                onChange={handleNumberChange}
              />
              <div className="form-help">
                Quanta energia riceverai al completamento (1-10)
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Annulla
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            {mission ? 'Salva Modifiche' : 'Crea Missione'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionModal;
