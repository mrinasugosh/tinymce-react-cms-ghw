import React from 'react';
import TinyEditor from './TinyEditor';

const Blog = ({ formData, onFormChange }) => {
  return (
    <div className="blogForm">
      <input
        type="text"
        name="title"
        className="form-control title-input"
        placeholder="Top 5 sights to see in Iceland in under a week"
        value={formData.title}
        onChange={onFormChange}
      />
      <TinyEditor />
    </div>
  );
};

export default Blog;
