var title = document.title
var bindClickShare = function() {
  var url = window.location.href
  var urlObj = {
    twitter: 'http://twitter.com/share?url=' + url + '&text=' + title,
    reddit: 'http://reddit.com/submit?url=' + url + '&title=' + title,
    facebook: 'http://www.facebook.com/sharer.php?u=' + url,
    linkedin: 'http://www.linkedin.com/shareArticle?mini=true&url=' + url,
    hackernews: 'https://news.ycombinator.com/submitlink?u=' + url + '&t=' + title,
  }
  $('a').click(function(e) {
    var type = $(this).data('type')
    if (type) {
      e.preventDefault()
      window.open(urlObj[type])
    }
  })
}
bindClickShare()