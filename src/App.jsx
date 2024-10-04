import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Blog from './components/Blog';
import './styles/App.css';

function App() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'James Swanson',
    publishDate: '2024-10-04',
    category: 'Travel Tips',
    tags: ['Sights', 'Itineraries', 'Europe'],
    cover: 'https://www.weather.is/wp-content/uploads/2023/03/Top25.png'
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="container">
      <div className="mainContent">
        <Blog formData={formData} onFormChange={handleFormChange} />
        <Sidebar formData={formData} handleFormChange={handleFormChange} />
      </div>
    </div>
  );
}

export default App;