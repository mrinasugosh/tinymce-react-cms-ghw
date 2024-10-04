import React from 'react';

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
      <textarea
        name="content"
        placeholder="Start writing your post here..."
        value={formData.content}
        onChange={onFormChange}
      />
    </div>
  );
};

export default Blog;
