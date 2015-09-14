$(function() {
  // Masonry grid
  var $grid = $('.grid').masonry({
    itemSelector: '.item',
    columnWidth: '.column-width'
  });

  $grid.imagesLoaded().progress(function() {
    $grid.masonry('layout');
  });

  // Lazy load
  var $window = $(window)
    , delay = 300;

  $window.on('scroll load', function(evt) {
    var queue = []
      , windowTop = $window.scrollTop()
      , windowBottom = windowTop + $window.height();

    $('.item:not(.active)').each(function() {
      var $item = $(this)
        , itemTop = $item.offset().top
        , itemBottom = itemTop + $item.height();

      windowTop <= itemTop
      && windowBottom >= itemBottom
      && queue.push($item);
    });

    $.each(queue, function(idx, item) {
      setTimeout(function() {
        item.addClass('active');
      }, delay * idx)
    })
  });

  // The lighty
  var $lighty = $('.lighty');
  $(document)
  .on('click', '.grid .item', function(evt) {
    var src = $(this).children('img').attr('src');

    $.get(
      src
      .replace(/\/photos\//g, '/records/')
      .replace(/\.jpg$/g, '.json')
    )
    .then(function(definition) {
      $lighty
      .find('.img').attr('src', src).attr('alt', definition.title).end()
      .find('.author').html(definition.author).attr('href', definition.authorUri).end()
      .find('.post').attr('href', definition.post).end()
      .find('.title').html(definition.title).end()
      .addClass('active');
    })
  })
  .on('click', '.lighty .inner .img, .lighty .inner .caption', function(evt) {
    evt.stopPropagation();
  })
  .on('click', function() {
    $lighty.removeClass('active')
  });
});
