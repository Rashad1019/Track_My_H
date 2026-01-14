import React, { useState } from 'react';
import './InputSection.css';

function InputSection({ onAddApplication }) {
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const extractJobDetails = (text, inputUrl) => {
        // Simple extraction logic - looks for common patterns
        const lines = text.split('\n').filter(line => line.trim());

        let position = '';
        let company = '';

        // Try to find job title (usually first substantive line or after keywords)
        const titlePatterns = [
            /(?:job\s*title|position|role):\s*(.+)/i,
            /(?:hiring|looking for|seeking)\s+(?:a\s+)?(.+?)(?:\s+at|\s+for|$)/i,
        ];

        for (const pattern of titlePatterns) {
            const match = text.match(pattern);
            if (match) {
                position = match[1].trim();
                break;
            }
        }

        // If no pattern matched, use first line as position
        if (!position && lines.length > 0) {
            position = lines[0].substring(0, 60);
        }

        // Try to find company name
        const companyPatterns = [
            /(?:company|employer|organization):\s*(.+)/i,
            /(?:at|@)\s+([A-Z][^,\n]+(?:Inc\.?|LLC|Ltd\.?|Corp\.?)?)/i,
            /([A-Z][a-zA-Z\s]+(?:Inc\.?|LLC|Ltd\.?|Corp\.?))/,
        ];

        for (const pattern of companyPatterns) {
            const match = text.match(pattern);
            if (match) {
                company = match[1].trim();
                break;
            }
        }

        // If still no company, try second line
        if (!company && lines.length > 1) {
            company = lines[1].substring(0, 40);
        }

        // Default values if extraction failed
        if (!position) position = 'Position Not Specified';
        if (!company) company = 'Company Not Specified';

        return {
            id: Date.now().toString(),
            position: position.replace(/[^\w\s-]/g, '').trim() || 'New Position',
            company: company.replace(/[^\w\s-]/g, '').trim() || 'Unknown Company',
            dateApplied: new Date().toISOString().split('T')[0],
            status: 'Applied',
            originalUrl: inputUrl || '',
            notes: ''
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!url.trim() && !description.trim()) {
            setFeedback({ type: 'error', message: 'Please enter a URL or job description' });
            return;
        }

        setIsLoading(true);
        setFeedback({ type: '', message: '' });

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const textToProcess = description || url;
            const jobDetails = extractJobDetails(textToProcess, url);

            onAddApplication(jobDetails);

            setUrl('');
            setDescription('');
            setFeedback({ type: 'success', message: 'Job added to your list!' });

            setTimeout(() => setFeedback({ type: '', message: '' }), 3000);
        } catch (error) {
            setFeedback({ type: 'error', message: 'Something went wrong. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="input-section">
            <form onSubmit={handleSubmit} className="input-form">
                <div className="input-group">
                    <label htmlFor="job-url" className="input-label">
                        Job Posting URL
                    </label>
                    <input
                        id="job-url"
                        type="url"
                        className="text-input"
                        placeholder="https://example.com/jobs/frontend-developer"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="or-divider">
                    <span>or paste job details</span>
                </div>

                <div className="input-group">
                    <label htmlFor="job-description" className="input-label">
                        Job Description
                    </label>
                    <textarea
                        id="job-description"
                        className="text-area"
                        placeholder="Paste the job title, company name, or full job description here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isLoading}
                        rows={4}
                    />
                </div>

                <button
                    type="submit"
                    className={`submit-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Finding job details...
                        </>
                    ) : (
                        <>
                            <span className="button-icon">📋</span>
                            Track This Job
                        </>
                    )}
                </button>

                {feedback.message && (
                    <div className={`feedback ${feedback.type}`}>
                        {feedback.type === 'success' && '✓ '}
                        {feedback.type === 'error' && '⚠ '}
                        {feedback.message}
                    </div>
                )}
            </form>
        </section>
    );
}

export default InputSection;
