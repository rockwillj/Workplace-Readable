/* 
 * Place "Expand All" button in each user content
 */

// User contents inserted dynamically on ajax loading
$(document).bind('wpr:onload', function () {
    $('#contentArea .userContent').each(function () {
        addExpandAllButton($(this));
    });
});

// User contents inserted dynamically on ajax paging
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
 * @author Atsushi Kambara (@atsukanrock)
 * @license MIT License
 * @see https://sansan.facebook.com/groups/663284547154538/permalink/712895618860097/
 * @note "See More" links in user contents are supported by @rockwillj
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
        var seeMoreLinksInContent = content.getElementsByClassName('see_more_link');
        var commentLinks = content.getElementsByClassName('UFICommentLink');
        var pagerLinks = content.getElementsByClassName('UFIPagerLink');
        var triggered = false;

        for (var i = 0; i < seeMoreLinks.length; i++) {
            triggerEvent(seeMoreLinks[i], 'click');
            triggered = true;
        }
        for (var i = 0; i < seeMoreLinksInContent.length; i++) {
            if (seeMoreLinksInContent[i].closest('.text_exposed') == null) {
                // "See More" links in user contents are supported by @rockwillj
                // If the ancestor element has 'text_exposed' class, it means "See More" link is collapsed.
                // If not, it means "See More" link is expanded already and also hidden.
                triggerEvent(seeMoreLinksInContent[i], 'click');
                triggered = true;
            }
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
