require 'sinatra'
require 'json'
require 'fileutils'

set bind: '0.0.0.0'

get '/' do
  "Hello"
end

get '/pages' do
  content_type :json

  current_directory = File.expand_path File.dirname(__FILE__)
  search_pattern = File.join(current_directory, 'editable_www', '*.html')
  pages_directory = File.join(current_directory, 'editable_www', '')
  Hash[
    Dir[search_pattern].map do |f_name|
      [f_name.gsub(pages_directory, ''), File.read(f_name)]
    end
  ].to_json
end

options '/pages' do
  response.headers["Access-Control-Allow-Origin"] = request.env["HTTP_ORIGIN"]
  response.headers["Access-Control-Allow-Methods"] = "POST"
  response.headers["Access-Control-Allow-Credentials"] = "true"

  p response.headers

  response.headers["Access-Control-Allow-Headers"] = "accept, content-type"
  halt 200
end

post '/pages' do
  data = JSON.parse(request.body.read)
  htmls = data['htmls']
  timestamp = Time.now.strftime("%H_%M_%S_%d_%m_%Y")
  current_directory = File.expand_path File.dirname(__FILE__)
  pages_directory = File.join(current_directory, 'editable_www', '')
  htmls.each do |f_name, content|
    f_path = pages_directory + f_name
    cp_path = pages_directory + timestamp + '_' + f_name
    FileUtils.cp f_path, cp_path
    File.write(f_path, content)
  end
  content_type :json
  response.headers["Access-Control-Allow-Credentials"] = "true"
  response.headers["Access-Control-Allow-Origin"] = request.env["HTTP_ORIGIN"]
  response.headers["Access-Control-Allow-Headers"] = "accept, content-type"
  { status: 'ok' }.to_json
end
