import React from 'react';
import './StatusBadge.css';

const statusConfig = {
    'Applied': { color: '#3B82F6', icon: '📤' },
    'Interview Scheduled': { color: '#8B5CF6', icon: '📅' },
    'Waiting for Response': { color: '#F59E0B', icon: '⏳' },
    'Rejected': { color: '#EF4444', icon: '❌' },
    'Offer Received': { color: '#10B981', icon: '🎉' }
};

function StatusBadge({ status, onChange, isEditable = false }) {
    const config = statusConfig[status] || statusConfig['Applied'];

    if (isEditable) {
        return (
            <select
                className="status-dropdown"
                value={status}
                onChange={(e) => onChange(e.target.value)}
                style={{ borderColor: config.color, color: config.color }}
            >
                {Object.keys(statusConfig).map((s) => (
                    <option key={s} value={s}>
                        {statusConfig[s].icon} {s}
                    </option>
                ))}
            </select>
        );
    }

    return (
        <span
            className="status-badge"
            style={{ backgroundColor: config.color }}
        >
            {config.icon} {status}
        </span>
    );
}

export default StatusBadge;
