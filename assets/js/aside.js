var getElementTopToScreenTop = function(element) {
  var elementOffsetTop = element.offset().top
  var windowScrollTop = $(window).scrollTop()
  return elementOffsetTop - windowScrollTop
}

var getElementBottomToScreenBottom = function(element) {
  return $(window).height() + $(document).scrollTop() - element.offset().top - element.outerHeight()
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
  var content = $('.middle-div')
  var aside = $('.aside')
  var contentToTop = getElementTopToScreenTop(content)
  aside.css("top", contentToTop)
  var asideInner = $('.aside .inner-div')
  scrollEvent(content, aside, asideInner)
}

var bindLeftTreeScroll = function() {
  var screenWidth = $(window).width()
  if (screenWidth <= 768) {
    return false
  }
  var content = $('.middle-div')
  var aside = $('.common-layout .left-tree')
  var contentToTop = getElementTopToScreenTop(content)
  aside.css("top", contentToTop)
  var asideInner = $('.left-div .inner-tree')
  scrollEvent(content, aside, asideInner)
}

var scrollEvent = function(content, aside, asideInner) {
  $( window ).scroll(function() {
    var headerHeight = $('header').outerHeight()
    var contentToTop = getElementTopToScreenTop(content)
    if (contentToTop < headerHeight + 10) {
      aside.css("top", headerHeight + 10)
      aside.css("bottom", 10)
      var s1 = getElementBottomToTop(content)
      var s2 = getElementBottomToTop(asideInner)
      if (s2 > s1) {
        var bottom = getElementBottomToScreenBottom(content)
        aside.css("bottom", bottom)
      }
    } else {
      aside.css("top", contentToTop)
      aside.css("bottom", 10)
    }
  });
}

var bindClickLink = function() {
  var aside = $('.aside')
  aside.find('a').click(function(event) {
    var id = $(this).attr('href')
    setTimeout(function() {
      scrollToElement(id)
    })
  })
}

var initScrollByHash = function() {
  var hash = decodeURI(window.location.hash)
  var element = $(hash)
  if (element.length > 0) {
    setTimeout(function() {
      scrollToElement(hash)
    })
  }
}

var scrollToElement = function(id) {
  var element = $(id)
  var headerHeight = $('header').outerHeight()
  var toTop = element.offset().top
  window.scrollTo(0, toTop - headerHeight)
}

var bindScrollTableActive = function() {
  var screenWidth = $(window).width()
  if (screenWidth <= 768) {
    return false
  }
  var aside = $('.aside')
  var headerHeight = $('header').outerHeight()
  $( window ).scroll(function() {
    aside.find('a').each(function() {
      var id = $(this).attr('href')
      var h = $(id)
      var elementToTop = getElementTopToScreenTop(h)
      if (elementToTop < headerHeight + 10) {
        aside.find('.active').removeClass('active')
        $(this).addClass('active')
      }
    })
  })
}

var bindScrollHeader = function() {
  var check = 100
  var header = $('header')
  var div = $('header > .common-layout')
  var originHeight = div.height()
  var nav = $('header .nav')
  $( window ).scroll(function() {
      var scrollY = window.scrollY;
      if (scrollY > 100) {
        div.css('height', 50)
        nav.css('line-height', '50px')
      } else {
        div.css('height', originHeight)
        nav.css('line-height', originHeight + 'px')
      }
  })
}

bindScrollHeader()

if ($('.aside').length > 0) {
  bindAsideScroll()
  bindScrollTableActive()
}
if ($('.common-layout .left-tree').length > 0) {
  bindLeftTreeScroll()
}
bindClickLink()
initScrollByHash()
