require 'sass/plugin/rack'
use Sass::Plugin::Rack

use Rack::Static,
  urls: ['/javascripts', '/stylesheets'],
  root: 'public'


{
  '/' => 'index',
  '/common' => 'common',
  '/pubsub' => 'pubsub',
}.each do |path, page_name|
  map path do
    run lambda { |env|
      [
        200,
        {
          'Content-Type'  => 'text/html',
          'Cache-Control' => 'public, max-age=86400'
        },
        File.open("public/#{page_name}.html", File::RDONLY)
      ]
    }
  end
end

