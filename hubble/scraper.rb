#!/usr/bin/env ruby
# coding: utf-8

require 'httparty'
require 'json'
require 'nokogiri'

url = "https://www.spacetelescope.org/images/archive/top100/"

if ! File.exist?("tmp/data.html")
  result = HTTParty.get(url)
  File.write("tmp/data.html", result.body)
end

output = []

doc = File.open("tmp/data.html") { |f| Nokogiri::HTML(f) }
doc.css("#top100-carousel .slide").each { |s|
  #puts s.inspect
  img = s.css("img").first
  url = img.attributes["data-lazy"].value

  s.css("div.top100-title").children.select { |c| c.name == "span" }.each { |c| c.remove }
  title = s.css("div.top100-title").text.strip

  big_url = url.gsub(/wallpaper2/, "publicationjpg")

  output << {
    "title" => title,
    "url" => url,
    "big_url" => big_url
  }
}

File.write("data.json", JSON.pretty_generate(output))

		# <div class="slide">
		# 	<div class="img-wrapper">
		# 		<img draggable="false" data-lazy="https://cdn.spacetelescope.org/archives/images/wallpaper2/heic1509a.jpg">
		# 		<button class="fullscreen" onclick="top100Fullscreen()">Fullscreen
		# 			<span class="fa fa-arrows-alt"></span>
		# 		</button>
		# 		<div class="top100-description">
		# 			<a href="/images/heic1509a/">
		# 				<div class="top100-title">
		# 					<span class="number">1.</span>
		# 					Westerlund 2 — Hubble’s 25th anniversary image
		# 				</div>
		# 				<div class="top100-text">
		# 					<br />This NASA/ESA Hubble Space Telescope image of the cluster Westerlund 2 and its surroundings has been released to celebrate Hubble’s 25th year in orbit and a quarter of a century of new discoveries, stunning images and outstanding science.<br />The image’s central region, containing the star cluster, blends visible-light data taken by the Advanced Camera for Surveys and near-infrared exposures taken by the Wide Field Camera 3. The surrounding region is composed of visible-light observations taken by the Advanced Camera for Surveys.
		# 				</div>
		# 			</a>
		# 		</div>
		# 	</div>
		# </div> <!-- slide -->
		
