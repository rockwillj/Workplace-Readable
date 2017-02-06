$(function () {
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
