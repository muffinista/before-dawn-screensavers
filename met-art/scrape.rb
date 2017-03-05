#!/usr/bin/env ruby

# highlights, artworks with image
require 'httparty'
require 'json'

@per_page = 100
@done = false
index = 0

@output = []

while @done == false
  if ! File.exist?("#{index}.json")
    offset = index * @per_page
  
    @url = "http://www.metmuseum.org/api/collection/collectionlisting?artist=&department=&era=&geolocation=&material=&offset=#{offset}&pageSize=0&perPage=#{@per_page}&showOnly=highlights%7CwithImage&sortBy=Relevance&sortOrder=asc"
  
    puts @url
    response = HTTParty.get(@url)
    puts response.body, response.code, response.message, response.headers.inspect

    File.write("#{index}.json", response.body)

    sleep 2
  end

  data = JSON.parse(File.read("#{index}.json"))

  if data["results"].empty?
    @done = true
  else
    @output = @output + data["results"]
  end

  index = index + 1
end              

File.write("data.json", JSON.pretty_generate(@output))
