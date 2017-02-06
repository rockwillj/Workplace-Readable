/* 
 * Add "Expand All" button in each user content
 */

// User content inserted dynamically on ajax loading
$(document).bind('wpr:onload', function () {
    $('#contentArea .userContent').each(function () {
        addExpandAllButton($(this));
    });
});

// User content inserted dynamically on ajax paging
$(document).bind('wpr:onpage', function (event, data) {
    $(data).find('.userContent').each(function () {
        addExpandAllButton($(this));
    });
});

// Add "Expand All" button in user content
function addExpandAllButton($content) {
    if ($content.is(':empty') || $content.children('.expandAll').length > 0) {
        return; // no need to add (empty or added already)
    }

    var shouldAdd = false;
    var $fbContent = $content.closest('.fbUserContent');
    if ($fbContent.find('.fss, .see_more_link, .UFIPagerLink').length > 0) {
        shouldAdd = true;
    }
    $fbContent.find('.UFICommentLink').each(function () {
        if ($(this).closest('.UFIReplyList').children('.UFIRow').length == 1) {
            shouldAdd = true;
        }
    });

    if (shouldAdd) {
        var $element = $('<a class="expandAll _42ft _4jy0 _4jy4 _517h _51sy" role="button" href="#">'
            + '<i class="_3-8_ img"></i>Expand All</a>');
        $content.prepend($element);

        $element.click(function () {
            expandAll($fbContent[0]);
            $(this).fadeOut('slow');
        });
    }
}

/**
 * WORKPLACE EXPAND ALL (全部開く君)
 * 
 * @author Atsushi Kanbara (@atsukanrock)
 * @license MIT License
 * @see https://sansan.facebook.com/groups/663284547154538/permalink/712895618860097/
 */
function expandAll(content) {
    var triggerEvent = function (element, event) {
        if (document.createEvent) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, true, true); // event type, bubbling, cancelable
            return element.dispatchEvent(evt);
        } else {
            var evt = document.createEventObject();
            return element.fireEvent("on" + event, evt)
        }
    };
    var intervalId = setInterval(function () {
        var seeMoreLinks = content.getElementsByClassName('fss');
        var commentLinks = content.getElementsByClassName('UFICommentLink');
        var pagerLinks = content.getElementsByClassName('UFIPagerLink');
        var triggered = false;

        for (var i = 0; i < seeMoreLinks.length; i++) {
            triggerEvent(seeMoreLinks[i], 'click');
            triggered = true;
        }
        for (var i = 0; i < commentLinks.length; i++) {
            if (commentLinks[i].closest('.UFIReplyList').getElementsByClassName('UFIRow').length == 1) {
                // If the reply list is still collapsed, open it. "Hide n Replies" link appears when 
                // there are a lot of replies nested below a comment and it cannot be distinguished
                // from "x replied · n Reply" link by the classes applied to it.
                triggerEvent(commentLinks[i], 'click');
                triggered = true;
            }
        }
        for (var i = 0; i < pagerLinks.length; i++) {
            triggerEvent(pagerLinks[i], 'click');
            triggered = true;
        }

        if (!triggered) {
            clearInterval(intervalId);
        }
    }, 1000);
}
