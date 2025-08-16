$(function() {
	includeNavbar();
	includeFooter();

	$('#modal-pathnotes-010').on('shown.bs.modal', function () {
		$('#modal-pathnotes-010-button').focus();
	});
});