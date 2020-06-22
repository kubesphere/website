var getElementTopToScreenTop = function(element) {
  var elementOffsetTop = element.offset().top
  var windowScrollTop = $(window).scrollTop()
  return elementOffsetTop - windowScrollTop
}

var getElementBottomToTop = function(element) {
  var elementHeight = element.outerHeight()
  var elementOffsetTop = element.offset().top
  return elementOffsetTop + elementHeight
}

var bindAsideScroll = function() {
  var screenWidth = $(window).width()
  if (screenWidth <= 768) {
    return false
  }
  var content = $('.main-div')
  var aside = $('.aside')
  $( window ).scroll(function() {
    var s1 = getElementBottomToTop(content)
    var s2 = getElementBottomToTop(aside)
    if (s2 > s1) {
        aside.addClass('aside-absolute').removeClass('aside-fixed')
    }
    if (getElementTopToScreenTop(aside) > 150) {
        aside.removeClass('aside-absolute').addClass('aside-fixed')
    }
  });
}

var bindClickLink = function() {
  var aside = $('.aside')
  var headerHeight = $('header').outerHeight()
  aside.find('a').click(function(event) {
    event.preventDefault()
    var id = $(this).attr('href')
    scrollToElement(id, headerHeight)
  })
}

var scrollToElement = function(id, headerHeight) {
  var element = $(id)
  var toTop = element.offset().top
  window.scrollTo(0, toTop - headerHeight)
}

bindAsideScroll()
bindClickLink()