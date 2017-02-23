$(function () {
    loadOptions();
    $('#save').click(saveOptions);
    $('#reset').click(resetOptions);
    $('input[type="color"]').change(function () {
        $(this).prev('input').val($(this).val());
    });

    function loadOptions() {
        chrome.storage.sync.get({
            color: '#365899',
            bgColor: '#ffff00'
        }, function (items) {
            $('#mentionColor').next('input').andSelf().val(items.color);
            $('#mentionBgColor').next('input').andSelf().val(items.bgColor);
        });
    }

    function saveOptions() {
        var color = $('#mentionColor').val();
        var bgColor = $('#mentionBgColor').val();
        chrome.storage.sync.set({
            color: color,
            bgColor: bgColor
        }, function () {
            $('#mentionColor + input').val(color);
            $('#mentionBgColor + input').val(bgColor);
            updateStatus('Options saved.');
        });
    }

    function resetOptions() {
        chrome.storage.sync.clear(function () {
            loadOptions();
            updateStatus('Options reset.');
        });
    }

    function updateStatus(message) {
        var $status = $('#status');
        $status.text(message);
        setTimeout(function () {
            $status.fadeOut('slow', function () {
                $status.text('').show();
            });
        }, 2000);
    }
});