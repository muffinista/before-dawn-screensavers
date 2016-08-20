#!/usr/bin/env ruby
require 'json'
puts JSON.dump(Dir["**/saver.json"].reject { |p| p =~ /^__/ }.collect { |p| p.split(/\//)[0] })
