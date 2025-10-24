function formatDate(dateInput) {
    const date = dateInput ? new Date(dateInput) : new Date();
    return date.toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
}

module.exports = { formatDate };