require 'rubygems'
require 'closure-compiler'

HEADER = /((^\s*\/\/.*\n)+)/
VERSION_NUM = %r{\$a\.VERSION = '(.+)';}

desc "Use the Closure Compiler to compress any.js"
task :build do
  source  = File.read('any.js')
  version = source.match(VERSION_NUM)[1] << ' (' << `git describe --always`.strip << ')'  
  header  = source.match(HEADER).to_s.gsub('@VERSION@', version).squeeze(' ')
  min     = Closure::Compiler.new.compress(source)
  File.open('any-min.js', 'w') do |file|
    file.write header + min
  end
end

desc "Build the docco documentation"
task :doc do
  sh "docco any.js"
end
