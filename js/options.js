$(function () {
    loadOptions();

    $('#save').click(saveOptions);
    $('#reset').click(resetOptions);
    $('.color input[type="text"]').change(function () {
        $(this).next('input').val($(this).val());
    });
    $('input[type="color"]').change(function () {
        $(this).prev('input').val($(this).val());
    });
    $('#trendingDisplay').change(function () {
        var unchecked = !$(this).prop('checked');
        $('#singleLineTrending').prop('disabled', unchecked)
            .closest('.option').toggleClass('disabled', unchecked);
    });

    function loadOptions() {
        chrome.storage.sync.get({
            liquidDesign: false,
            sidebarDisplay: false,
            topGroupsDisplay: true,
            trendingDisplay: true,
            singleLineTrending: true,
            color: '#365899',
            bgColor: '#ffff00'
        }, function (items) {
            $('#liquidDesign').prop('checked', items.liquidDesign);
            $('#sidebarDisplay').prop('checked', items.sidebarDisplay);
            $('#topGroupsDisplay').prop('checked', items.topGroupsDisplay);
            $('#trendingDisplay').prop('checked', items.trendingDisplay).change();
            $('#singleLineTrending').prop('checked', items.singleLineTrending);
            $('#mentionColor').next('input').andSelf().val(items.color);
            $('#mentionBgColor').next('input').andSelf().val(items.bgColor);
        });
    }

    function saveOptions() {
        var liquidDesign = $('#liquidDesign').prop('checked');
        var sidebarDisplay = $('#sidebarDisplay').prop('checked');
        var topGroupsDisplay = $('#topGroupsDisplay').prop('checked');
        var trendingDisplay = $('#trendingDisplay').prop('checked');
        var singleLineTrending = $('#singleLineTrending').prop('checked');
        var color = $('#mentionColor').val();
        var bgColor = $('#mentionBgColor').val();
        chrome.storage.sync.set({
            liquidDesign: liquidDesign,
            sidebarDisplay: sidebarDisplay,
            topGroupsDisplay: topGroupsDisplay,
            trendingDisplay: trendingDisplay,
            singleLineTrending: singleLineTrending,
            color: color,
            bgColor: bgColor
        }, function () {
            $('#mentionColor + input').val(color);
            $('#mentionBgColor + input').val(bgColor);
            updateStatus('Options saved.');
        });
    }

    function resetOptions() {
        chrome.storage.sync.remove([
            'liquidDesign',
            'sidebarDisplay',
            'topGroupsDisplay',
            'trendingDisplay',
            'singleLineTrending',
            'color',
            'bgColor'
        ], function () {
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