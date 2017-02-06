$(function () {
    // onload: Trigger ajax loading event
    $(document).trigger('wpr:onload');
    var ajaxObserver = new MutationObserver(function (mutation) {
        var removedNodes = mutation[0].removedNodes;
        for (var i = 0; i < removedNodes.length; i++) {
            if (removedNodes[i].src) {
                if (removedNodes[i].src.indexOf('LitestandTailLoadPagelet') != -1
                    || removedNodes[i].src.indexOf('GroupEntstreamPagelet') != -1) {
                    continue; // ajax paging
                }
                $(document).trigger('wpr:onload'); // ajax loading
            }
        }
    });
    ajaxObserver.observe($('body')[0], { childList: true });

    /*
     * Highlight mentions to me
     */
    var href = $('#pagelet_bluebar a[href*="profile.php"]').attr('href');
    var match = /profile\.php\?id=(\d+)/.exec(href);
    if (match && match.length == 2) {
        var style = document.createElement('style');
        document.head.appendChild(style);
        var rule = '.profileLink[href*="' + match[1] + '"] { background: yellow; }';
        style.sheet.insertRule(rule, 0);
    }
});

// onpage: Trigger ajax paging event
$(document).bind('wpr:onload', function () {
    var $pager = $('#pagelet_group_pager').prev(); // Group
    if ($pager.length == 0) {
        $pager = $('#contentArea div[id^="more_pager_pagelet_"]').children(); // Home
    }
    if ($pager.length > 0) {
        var pagingObserver = new MutationObserver(function (mutation) {
            var addedNodes = mutation[0].addedNodes;
            for (var i = 0; i < addedNodes.length; i++) {
                $(document).trigger('wpr:onpage', addedNodes[i]);
            }
        });
        pagingObserver.observe($pager[0], { childList: true, subtree: true });
    }
});
