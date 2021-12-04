#!/usr/bin/env ruby

#
# this is the original script i used to get a bunch of data out of the
# met api. i don't think it's really working right now.
#

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
  
  #  @url = "http://www.metmuseum.org/api/collection/collectionlisting?artist=&department=&era=&geolocation=&material=&offset=#{offset}&pageSize=0&perPage=#{@per_page}&showOnly=highlights%7CwithImage&sortBy=Relevance&sortOrder=asc"
    @url = "https://www.metmuseum.org/api/collection/collectionlisting?showOnly=highlights&withImage=true&offset=#{offset}&pageSize=0&perPage=#{@per_page}&sortBy=Relevance&sortOrder=asc"
    
    puts @url
    puts "curl \"#{@url}\" > #{index}.json"
    `curl \"#{@url}\" > #{index}.json`
#    response = HTTParty.get(@url)
#    puts response.body, response.code, response.message, response.headers.inspect
#    File.write("#{index}.json", response.body)

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

@output = @output.collect { |row|
  puts row.inspect
  original = row["image"].gsub(/mobile-large/, "original");
  begin
    puts original
    result = HTTParty.head(original)
    if result.code == 200
      row["original"] = original
    else
      row["original"] = nil
    end
  rescue
    row["original"] = nil
  end
  
  sleep 2
  row
}

File.write("data.json", JSON.pretty_generate(@output))
