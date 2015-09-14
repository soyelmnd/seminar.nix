<?php
$basePath = dirname(__FILE__);
$baseUri = '//' . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'] . dirname($_SERVER['REQUEST_URI']);

$images = glob($basePath . '/res/photos/*.jpg');

// Sort by mdate
$mtimes = array();
foreach($images as $image) {
  $mtimes[$image] = filemtime($image);
}
arsort($mtimes);
$images = array_keys($mtimes);

// Grab the uri
foreach($images as $idx => $image) {
  $images[$idx] = str_replace($basePath, $baseUri, $image);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>501px</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link rel="stylesheet" href="./assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="./assets/css/main.css">
</head>
<body>
  <div class="container-fluid">
    <div class="grid row">
      <div class="column-width col-lg-2 col-md-3 col-sm-4 col-xs-6"></div>
<?php
foreach($images as $image):
?>
      <div class="item col-lg-2 col-md-3 col-sm-4 col-xs-6">
        <img src="<?php echo $image; ?>" class="img-responsive" />
      </div>
<?php
  endforeach;
?>
    </div>
  </div>
  <div class="lighty">
    <div class="inner">
      <img class="img">
      <div class="caption">
        <a class="post title" href="#" target="_blank"></a>
        by
        <a class="author" href="#" target="_blank"></a>
      </div>
    </div>
  </div>
  <script src="./assets/js/jquery-1.11.3.min.js"></script>
  <script src="./assets/js/masonry.pkgd.min.js"></script>
  <script src="./assets/js/imagesloaded.pkgd.js"></script>
  <script src="./assets/js/main.js"></script>
</body>
</html>
