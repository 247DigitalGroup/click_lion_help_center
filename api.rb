require 'sinatra'
require 'json'
require 'fileutils'

set bind: '0.0.0.0'

def get_pages_string
  current_directory = File.expand_path File.dirname(__FILE__)
  pages_file = File.join(current_directory, 'pages.json')
  File.read(pages_file)
end

before do
  if request.env['HTTP_ORIGIN']
    response.headers["Access-Control-Allow-Origin"] = request.env["HTTP_ORIGIN"]
  end

  response.headers["Access-Control-Allow-Credentials"] = "true"

  response.headers["Access-Control-Allow-Headers"] = "accept, content-type"
end

get '/' do
  "Hello"
end

get '/pages' do
  content_type :json
  get_pages_string
end

get '/pages/:id' do
  p response.headers
  id = params['id']
  pages_strong = get_pages_string
  pages = JSON.parse(pages_strong)
  pages.each do |page|
    halt(200, page.to_json) if page['id'] == id
  end
  content_type :json
  halt(200, {}.to_json)
end

post '/pages/:id' do
  id = params['id']
  data = JSON.parse(request.body.read)
  pages_strong = get_pages_string
  pages = JSON.parse(pages_strong)
  p data
  index = pages.find_index do |page|
    page['id'] == id
  end
  if index
    pages[index] = data
  else
    pages << data
  end
  current_directory = File.expand_path File.dirname(__FILE__)
  pages_file = File.join(current_directory, 'pages.json')
  File.write(pages_file, JSON.pretty_generate(pages))
  content_type :json
  { status: 'ok' }.to_json
end

options '/pages' do
  response.headers["Access-Control-Allow-Methods"] = "POST"
  halt 200
end

options '/pages/:id' do
  response.headers["Access-Control-Allow-Methods"] = "POST"
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
  { status: 'ok' }.to_json
end
