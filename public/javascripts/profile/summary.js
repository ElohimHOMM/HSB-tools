document.addEventListener('DOMContentLoaded', () => {
	const params = new URLSearchParams(window.location.search);
    console.log("AdminOnly: " + params.get('adminOnly'))
	if (params.get('adminOnly') === 'true') {
		params.delete('adminOnly');
		const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
		window.history.replaceState({}, '', newUrl);
		showErrorToast('This feature is only available for administrators.');
	}
});
