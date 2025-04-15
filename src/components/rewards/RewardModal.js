import React, { useState, useEffect } from 'react';

const RewardModal = ({ reward, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    energyCost: 5
  });

  // Initialize form with reward data if editing
  useEffect(() => {
    if (reward) {
      setFormData({
        ...reward,
        energyCost: reward.energyCost || 5
      });
    }
  }, [reward]);

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
            {reward ? 'Modifica Ricompensa' : 'Nuova Ricompensa'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Titolo della Ricompensa</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Es. Pozione di Svago: Un Film Fantasy"
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
                placeholder="Es. Guardare un film fantasy per 2 ore"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="energyCost">Costo in Energia</label>
              <input
                type="number"
                id="energyCost"
                name="energyCost"
                min="1"
                max="50"
                value={formData.energyCost}
                onChange={handleNumberChange}
              />
              <div className="form-help">
                Quanta energia è necessaria per riscattare questa ricompensa (1-50)
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-secondary">
            Annulla
          </button>
          <button onClick={handleSubmit} className="btn btn-create">
            {reward ? 'Salva Modifiche' : 'Crea Ricompensa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
