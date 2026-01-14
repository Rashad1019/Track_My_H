import React, { useState, useMemo } from 'react';
import ApplicationCard from './ApplicationCard';
import './ApplicationList.css';

const STATUS_ORDER = [
    'Offer Received',
    'Interview Scheduled',
    'Applied',
    'Waiting for Response',
    'Rejected'
];

function ApplicationList({ applications, onUpdate, onDelete }) {
    const [sortBy, setSortBy] = useState('date');
    const [filterStatus, setFilterStatus] = useState('all');

    const sortedAndFiltered = useMemo(() => {
        let result = [...applications];

        // Filter
        if (filterStatus !== 'all') {
            result = result.filter(app => app.status === filterStatus);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.dateApplied) - new Date(a.dateApplied);
            } else if (sortBy === 'status') {
                return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
            } else if (sortBy === 'company') {
                return a.company.localeCompare(b.company);
            }
            return 0;
        });

        return result;
    }, [applications, sortBy, filterStatus]);

    const statusCounts = useMemo(() => {
        const counts = { all: applications.length };
        applications.forEach(app => {
            counts[app.status] = (counts[app.status] || 0) + 1;
        });
        return counts;
    }, [applications]);

    if (applications.length === 0) {
        return (
            <section className="empty-state">
                <div className="empty-icon">📋</div>
                <h2>No applications yet</h2>
                <p>Start tracking your job search by adding your first application above!</p>
            </section>
        );
    }

    return (
        <section className="application-list-section">
            <div className="list-header">
                <h2 className="list-title">
                    Your Applications
                    <span className="count-badge">{applications.length}</span>
                </h2>

                <div className="list-controls">
                    <div className="control-group">
                        <label htmlFor="sort-select">Sort:</label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="control-select"
                        >
                            <option value="date">Most Recent</option>
                            <option value="status">Status</option>
                            <option value="company">Company A-Z</option>
                        </select>
                    </div>

                    <div className="control-group">
                        <label htmlFor="filter-select">Show:</label>
                        <select
                            id="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="control-select"
                        >
                            <option value="all">All ({statusCounts.all})</option>
                            <option value="Applied">Applied ({statusCounts['Applied'] || 0})</option>
                            <option value="Interview Scheduled">Interviews ({statusCounts['Interview Scheduled'] || 0})</option>
                            <option value="Waiting for Response">Waiting ({statusCounts['Waiting for Response'] || 0})</option>
                            <option value="Offer Received">Offers ({statusCounts['Offer Received'] || 0})</option>
                            <option value="Rejected">Rejected ({statusCounts['Rejected'] || 0})</option>
                        </select>
                    </div>
                </div>
            </div>

            {sortedAndFiltered.length === 0 ? (
                <div className="no-results">
                    <p>No applications match the filter "{filterStatus}"</p>
                    <button
                        className="clear-filter-btn"
                        onClick={() => setFilterStatus('all')}
                    >
                        Show all applications
                    </button>
                </div>
            ) : (
                <div className="cards-grid">
                    {sortedAndFiltered.map(app => (
                        <ApplicationCard
                            key={app.id}
                            application={app}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default ApplicationList;
