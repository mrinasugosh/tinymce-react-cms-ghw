import React from 'react';

const Sidebar = ({ formData, onFormChange }) => {
  return (
    <div className="sidebar">
      <button type="button" className="btn">Publish</button>
      <div className="form-group">
        <label>Author</label>
        <select className="form-control" name="author" defaultValue={formData.author} onChange={onFormChange}>
          <option>Mrina Sugosh</option>
          <option>Coco Poley</option>
          <option>Vadim Smirnov</option>
          <option>Brad Lawless</option>
        </select>
      </div>
      <div className="form-group">
        <label>Publish Date</label>
        <input type="text" className="form-control" name="publishDate" defaultValue={formData.publishDate} onChange={onFormChange} />
      </div>
      <div className="form-group">
        <label>Category</label>
        <input type="text" className="form-control" name="category" defaultValue={formData.category} onChange={onFormChange} />
      </div>
      <div className="form-group">
        <label>Tags</label>
        <input type="text" className="form-control" name="tags" defaultValue={formData.tags.join(', ')} onChange={onFormChange} />
      </div>
      <div className="form-group">
        <label>Cover</label>
        <input type="text" className="form-control" name="cover" defaultValue={formData.cover} onChange={onFormChange} />
        {formData.cover && (
          <img src={formData.cover} alt="Cover" className="img-fluid mt-3" />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
