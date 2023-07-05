import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';

function Profile() {
const [email, setEmail] = useState('');
const [role, setRole] = useState('');
const [editMode, setEditMode] = useState(false);
const [newEmail, setNewEmail] = useState('');
const updateProfile = (newEmail, newRole) => {
  setEmail(newEmail);
  setRole(newRole);
};


  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:8080/profile', {
        params: {
          email: 'admin@gmail.com'
        }
      });
      setNewEmail(response.data.email);
      updateProfile(response.data.email, response.data.role);
    } catch (error) {
     console.error('Error in profile', error);
    }
  };

  useEffect(() => {
  fetchProfile();
  }, []);

const handleEditClick = () => {
  setEditMode(true);
  setNewEmail(email);
};

const handleSaveClick = () => {
  updateProfile(newEmail, role); 
  setEditMode(false);
};

const handleCancelClick = () => {
  setEditMode(false);
};

const handleEmailChange = (e) => {
  setNewEmail(e.target.value);
};


  return (
    <div className='px-5 py-3'>
        <div className='d-flex justify-content-center mt-2'>
    <h3>Perfil do Administrador</h3>
    </div>
    <div className="profile-info">
      <p>Função: {role}</p>
        <div className="field">
          <label>Email:</label>
          {editMode ? (
            <input
              type="text"
              value={newEmail}
              onChange={handleEmailChange}
            />
          ) : (
            <span>{email}</span>
          )}
        </div>
        {editMode ? (
          <div className="buttons">
            <button className="btn btn-success" onClick={handleSaveClick}>
              Salvar
            </button>
            <button className="btn btn-danger" onClick={handleCancelClick}>
              Cancelar
            </button>
          </div>
        ) : (
          <div className="buttons">
            <button className="btn btn-primary" onClick={handleEditClick}>
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
      
  )
}

export default Profile;