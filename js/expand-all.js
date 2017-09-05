/* 
 * Place "Expand All" button in each user content
 */

$(function () {
    $(document).on('mouseenter', '.userContentWrapper, .fbUserContent, .fbUserPost', function () {
        if ($(this).find('.userContentWrapper, .fbUserContent, .fbUserPost').length > 0) {
            return; // this is not body but header content
        }
        $(this).find('.userContent').each(function () {
            addExpandAllButton($(this).not(':empty'));
        });
    });

    // Add "Expand All" button in user content
    function addExpandAllButton($content) {
        if ($content.prev().children('.expandAll').length > 0) {
            return; // already added
        }

        var shouldAdd = false;
        var $wrapper = $content.closest('.userContentWrapper, .fbUserContent, .fbUserPost');
        if ($wrapper.find('.fss, .see_more_link, .UFIPagerLink').length > 0) {
            shouldAdd = true;
        }
        $wrapper.find('.UFICommentLink').each(function () {
            if ($(this).closest('.UFIReplyList').children('.UFIRow').length == 1) {
                shouldAdd = true;
            }
        });

        if (shouldAdd) {
            $(`<a class="expandAll _42ft _4jy0 _4jy4 _517h _51sy"
                   role="button" title="Expand All" href="#">
                   <i class="img"></i>
               </a>`)
                .click(function () {
                    expandAll($wrapper[0]);
                    $(this).fadeOut('slow');
                })
                .prependTo($content.prev());
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
});
