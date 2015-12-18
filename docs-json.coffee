fs = require 'fs'

files = fs.readdirSync './www/'
json = {}
for f in files
  ext = f
    .split '.'
    .pop()
  if ext is 'html'
    content = fs.readFileSync './www/' + f, 'utf8'
    json[f.split('.').slice(0, -1)] = content

fs.writeFileSync 'docs.json', JSON.stringify(json), 'utf8'