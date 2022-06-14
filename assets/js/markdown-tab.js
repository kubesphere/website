// tab
$('.tab-content').find('.tab-pane').each(function (idx, item) {
  var navTabs = $(this).closest('.code-tabs').find('.nav-tabs'),
    title = $(this).attr('title');
  navTabs.append('<li class="nav-item"><a class="nav-link" href="#">' + title + '</a></li>');
});

$('.code-tabs ul.nav-tabs').each(function () {
  $(this).find("li:first").addClass('active');
})

$('.code-tabs .tab-content').each(function () {
  $(this).find("div:first").addClass('active');
});

$('.nav-tabs a').click(function (e) {
  e.preventDefault();
  var tab = $(this).parent(),
    tabIndex = tab.index(),
    tabPanel = $(this).closest('.code-tabs'),
    tabPane = tabPanel.find('.tab-pane').eq(tabIndex);
  tabPanel.find('.active').removeClass('active');
  tab.addClass('active');
  tabPane.addClass('active');
});

// copy button
function addCopyButtons(clipboard) {
  document.querySelectorAll('pre > code').forEach(function (codeBlock) {
      var div = document.createElement('div');
      div.className = 'code-over-div';
      var button = document.createElement('div');
      button.className = 'copy-code-button';
      button.title = "Copy Code"
      button.addEventListener('click', function () {
          clipboard.writeText(codeBlock.innerText).then(function () {
              button.classList.add("is-active");
              button.blur();
              setTimeout(function() {
                  button.classList.remove("is-active");
              }, 2000);
          }, function (error) {
          });
      });
      var pre = codeBlock.parentNode;
      pre.insertBefore(button, codeBlock);
      div.appendChild(codeBlock)
      pre.appendChild(div)
  });
}
$('pre').css('background', '#242e42')
if (navigator && navigator.clipboard) {
    addCopyButtons(navigator.clipboard);
}