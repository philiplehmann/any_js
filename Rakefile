require 'rubygems'
require 'closure-compiler'

HEADER = /((^\s*\/\/.*\n)+)/
VERSION_NUM = %r{\$a\.VERSION = '(.+)';}

def version
  @version ||= source.match(VERSION_NUM)[1] << ' (rev:' << `git describe --always`.strip << ')'  
end

def source
  @source ||= File.read('any.js')  
end

desc "Use the Closure Compiler to compress any.js"
task :build do
  header  = source.match(HEADER).to_s.gsub('@VERSION@', version).squeeze(' ')
  min     = Closure::Compiler.new.compress(source)
  File.open('any-min.js', 'w') do |file|
    file.write header + min
  end
end

desc "Build the docco documentation"
task :doc do
  sh "docco any.js"
  sh "sed 's/@VERSION@/#{version}/' docs/any.html > docs/_any.html"
  mv 'docs/_any.html', 'docs/any.html'
end
