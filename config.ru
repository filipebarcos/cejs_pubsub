require 'sass/plugin/rack'
use Sass::Plugin::Rack

use Rack::Static,
  urls: ['/javascripts', '/stylesheets'],
  root: 'public'

run lambda { |env|
  [
    200,
    {
      'Content-Type'  => 'text/html',
      'Cache-Control' => 'public, max-age=86400'
    },
    File.open('index.html', File::RDONLY)
  ]
}
