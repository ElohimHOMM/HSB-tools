$(function() {
    includeNavbar();
    includeFooter();
    
    $('#modal-pathnotes-010').on('shown.bs.modal', function () {
      $('#modal-pathnotes-010-button').trigger('focus')
    });
    
    $("#start-button").click(function() {
        let baseDropChance = $("#input-bdc").val();
        let magicFind = $("#input-mf").val();
        let output = $("#p-output");

        let chances = (baseDropChance / 100) * (1 + (magicFind / 100))
        let inAmount = Math.round((1 / chances) * 100) / 100;
        chances = 100 * chances;

        output.html(`Chances: ${chances}%<br>That is a 1 in ${inAmount}`)
    });
});