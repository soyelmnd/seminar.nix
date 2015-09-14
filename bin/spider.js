var startUrl = 'https://500px.com/fresh?categories=Nude'
  , firstPage = 1
  , maxPage = 10
  , maxDuplicates = 10;

var fs = require('fs');
var casper = require('casper').create({
  pageSettings: {
    webSecurityEnabled: false
  }
});

console.log(
  'Crawling maximum of ' + maxPage + ' pages, '
  + maxDuplicates + ' duplicates per page is allowed\n'
);
(function openPage(p) {
  var duplicates = 0;

  if(p) {
    console.log('\nGo to page ' + p + ' @ `' + startUrl + '&page=' + (firstPage + p) + '` ..');
    casper.open(startUrl + '&page=' + (firstPage + p)).then(onPageLoad)
  } else {
    console.log('Start with the first page @ `' + startUrl + '&page' + (firstPage + p) + '` ..');
    casper.start(startUrl + '&page=' + (firstPage + p), onPageLoad);
  }

  function onPageLoad() {
    // Grab all posts on this page
    console.log('Grabbing posts ..');
    var posts = this.evaluate(function() {
      var posts = [];
      $('.grid .photo > a').each(function() {
        this.href && posts.push(this.href);
      });
      return posts;
    });
    console.log('* ' + posts.join('\n* '));

    // Start visiting
    //   post by post
    //   and grab images
    (function openPost(i) {
      var post = posts[i];

      console.log('\nPost @ `' + post + '` ..');
      casper.open(post);

      casper.then(function() {
        // Grab the image
        var img = this.evaluate(function() {
          return {
            uri: $('.the_photo').attr('src'),
            title: $('.photo_header .name').text(),
            author: $('.photo_header .author_name').text(),
            authorLink: $('.photo_header .user_profile_link').attr('href')
          }
        });
        console.log('`' + img.title + '` by `' + img.author + '` @ ' + img.uri);

        var imgName = img.authorLink.replace(/.+?\/([^\/]+)$/, '$1') + '@'
                    + img.uri.replace(/.+?\/([^\/]+)$/, '$1');

        var recordPath = 'res/records/' + imgName + '.json'
          , photoPath = 'res/photos/' + imgName + '.jpg';

        if(fs.exists(photoPath)) {
          ++duplicates;

          console.log('Already existed. ');

          if(maxDuplicates == duplicates) {
            console.log('Maximum duplicates reached. Halt.');
          } else {
            console.log((maxDuplicates - duplicates) + ' duplicates left before halt');
            next();
          }
        } else {
          save.call(this);
          next();
        }

        /**
         * @description
         * Download image and generate record
         */
        function save() {
          console.log('Saving image to ' + photoPath);
          this.download(img.uri, photoPath);

          console.log('Saving record to ' + recordPath);
          fs.makeTree(recordPath.replace(/^(.+?\/)[^\/]+$/, '$1'));
          fs.write(recordPath, JSON.stringify({
            title: img.title,
            path: photoPath,
            uri: img.uri,
            author: img.author,
            authorUri: img.authorLink,
            post: post
          }), 'w');
        }

        /**
         * @description
         * Next post, next page or halt
         */
        function next() {
          if(i < posts.length - 1) {
            openPost(++i)
          } else {
            if(p < maxPage) {
              openPage(++p);
            } else {
              console.log('Last page completed. Halt.');
            }
          }
        }
      });
    })(0);
  }
})(0);

casper.run();
