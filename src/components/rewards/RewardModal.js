import React, { useState, useEffect } from 'react';

const RewardModal = ({ reward, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    energyCost: 5,
    category: 'entertainment',
    icon: 'fa-tv'
  });

  // Initialize form with reward data if editing
  useEffect(() => {
    if (reward) {
      setFormData({
        ...reward,
        energyCost: reward.energyCost || 5,
        category: reward.category || 'entertainment',
        icon: reward.icon || 'fa-tv'
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

  // Available reward categories with corresponding icons
  const rewardCategories = [
    { id: 'entertainment', name: 'Intrattenimento', icon: 'fa-tv' },
    { id: 'gaming', name: 'Videogiochi', icon: 'fa-gamepad' },
    { id: 'rest', name: 'Riposo', icon: 'fa-bed' },
    { id: 'food', name: 'Cibo', icon: 'fa-utensils' },
    { id: 'social', name: 'Sociale', icon: 'fa-users' },
    { id: 'hobby', name: 'Hobby', icon: 'fa-palette' },
    { id: 'outdoor', name: 'Attività all\'aperto', icon: 'fa-mountain' },
    { id: 'shopping', name: 'Shopping', icon: 'fa-shopping-bag' },
    { id: 'other', name: 'Altro', icon: 'fa-star' }
  ];

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

            <div className="form-group">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={(e) => {
                  const selectedCategory = rewardCategories.find(cat => cat.id === e.target.value);
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    icon: selectedCategory ? selectedCategory.icon : 'fa-star'
                  });
                }}
              >
                {rewardCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Icona</label>
              <div className="icon-selector">
                {rewardCategories.map(category => (
                  <div
                    key={category.id}
                    className={`icon-option ${formData.icon === category.icon ? 'selected' : ''}`}
                    onClick={() => setFormData({
                      ...formData,
                      category: category.id,
                      icon: category.icon
                    })}
                  >
                    <i className={`fas ${category.icon}`}></i>
                    <span>{category.name}</span>
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
            {reward ? 'Salva Modifiche' : 'Crea Ricompensa'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
