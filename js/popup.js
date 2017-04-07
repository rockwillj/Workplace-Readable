$(function () {
    showPosts();

    $(document).on('click', '.delete', function () {
        var $post = $(this).closest('.post');
        removePost($post.attr('id'), function () {
            $post.fadeOut('slow', function () {
                if ($('.post:visible').length == 0) {
                    window.close();
                }
            });
        });
    });

    function showPosts() {
        chrome.storage.sync.get({ posts: [], hostname: '' }, function (items) {
            $.each(items.posts, function (i, post) {
                var date = new Date(post.date);
                $('#posts').prepend(`
                    <div class="post" id="${post.url}">
                        <ul>
                            <li><a href="https://${items.hostname + post.url}" target="_blank">${post.intro}</a></li>
                            <li>
                                by <span>${post.author}</span>
                                in <span>${post.group}</span>
                                at <span>${date.getMonth() + 1}/${date.getDate()}</span>
                                <img class="delete" src="../image/delete.png">
                            </li>
                        </ul>
                    </div>`);
            });

            $('#alert').toggle($('.post').length == 0);
        });
    }

    function removePost(url, callback) {
        chrome.storage.sync.get({ posts: [] }, function (items) {
            var index = getPostIndexOf(items.posts, url);
            items.posts.splice(index, 1);

            chrome.storage.sync.set({ posts: items.posts }, callback);
        });
    }

    function getPostIndexOf(posts, url) {
        var index = -1;
        $.each(posts, function (i, post) {
            if (post.url == url) {
                index = i;
                return false;
            }
        });
        return index;
    }
});