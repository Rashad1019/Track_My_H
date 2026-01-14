import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import './ApplicationCard.css';

function ApplicationCard({ application, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        position: application.position,
        company: application.company,
        notes: application.notes || ''
    });

    const handleStatusChange = (newStatus) => {
        onUpdate({ ...application, status: newStatus });
    };

    const handleSave = () => {
        onUpdate({ ...application, ...editData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditData({
            position: application.position,
            company: application.company,
            notes: application.notes || ''
        });
        setIsEditing(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <article className={`application-card ${isEditing ? 'editing' : ''}`}>
            {isEditing ? (
                <div className="edit-mode">
                    <div className="edit-field">
                        <label>Position</label>
                        <input
                            type="text"
                            value={editData.position}
                            onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                            placeholder="Job Title"
                        />
                    </div>
                    <div className="edit-field">
                        <label>Company</label>
                        <input
                            type="text"
                            value={editData.company}
                            onChange={(e) => setEditData({ ...editData, company: e.target.value })}
                            placeholder="Company Name"
                        />
                    </div>
                    <div className="edit-field">
                        <label>Notes</label>
                        <textarea
                            value={editData.notes}
                            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                            placeholder="Add any notes..."
                            rows={2}
                        />
                    </div>
                    <div className="edit-actions">
                        <button className="btn btn-save" onClick={handleSave}>
                            ✓ Save
                        </button>
                        <button className="btn btn-cancel" onClick={handleCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="card-header">
                        <h3 className="job-position">{application.position}</h3>
                        <StatusBadge
                            status={application.status}
                            onChange={handleStatusChange}
                            isEditable={true}
                        />
                    </div>

                    <p className="company-name">{application.company}</p>

                    <div className="card-meta">
                        <span className="date-applied">
                            📅 Applied: {formatDate(application.dateApplied)}
                        </span>
                        {application.originalUrl && (
                            <a
                                href={application.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="job-link"
                            >
                                🔗 View posting
                            </a>
                        )}
                    </div>

                    {application.notes && (
                        <p className="notes">{application.notes}</p>
                    )}

                    <div className="card-actions">
                        <button
                            className="btn btn-edit"
                            onClick={() => setIsEditing(true)}
                            aria-label="Edit application"
                        >
                            ✏️ Edit
                        </button>
                        <button
                            className="btn btn-delete"
                            onClick={() => onDelete(application.id)}
                            aria-label="Delete application"
                        >
                            🗑️ Delete
                        </button>
                    </div>
                </>
            )}
        </article>
    );
}

export default ApplicationCard;
