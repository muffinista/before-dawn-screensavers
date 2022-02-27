#!/usr/bin/env ruby

require 'httparty'
require 'json'

#
# this is a hacky script to get a list of IDs out of the met museum collection API
# as written, it should get IDs for anything in the collection that is a highlight and
# has an associated image. Since you need to pass a query string, we hack around
# that by querying each letter of the alphabet and 0-9.
#

index = 0

@output = []

(('a'..'z').to_a + ('0'..'9').to_a).each do |index|
  @url =  "https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&title=true&hasImages=true&q=#{index}*"
    
  puts @url
  response = HTTParty.get(@url)
  puts response.body, response.code, response.message, response.headers.inspect


  result = JSON.parse(response.body)
  if result['total'].to_i > 0
    @output = @output + result['objectIDs']
    File.write("ids.json", @output.to_json)
  end

  sleep 5
end
