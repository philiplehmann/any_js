require 'rubygems'
require 'closure-compiler'

HEADER = /((^\s*\/\/.*\n)+)/
VERSION_NUM = %r{\$a\.VERSION = '(.+)';}

def version
  @version ||= source(:core).match(VERSION_NUM)[1] << ' (rev:' << `git describe --always`.strip << ')'  
end

def source(*args)
  args.flatten.uniq.inject('') do |str,js|
    str << File.read("any.#{js.to_s.gsub('_', '.')}.js")
  end
end

def header
  @header ||= source(:core).match(HEADER).to_s.gsub('@VERSION@', version).squeeze(' ')
end

desc "Use the Closure Compiler to compress any.js"
task :build do
  { 'any-min.js' => %w{core},
    'any.mt-min.js' => %w{mt.moz mt.webkit mt.emulate mt},
    'any.all-min.js' => %w{core mt.moz mt.webkit mt.emulate mt}
  }.each do |js,components|
    min     = Closure::Compiler.new.compress(source(components))
    File.open(js, 'w') do |file|
      file.write header + min
    end
  end
end

desc "Build the docco documentation"
task :doc do
  sh "docco any.core.js any.mt.js any.mt.moz.js"
  sh "sed 's/@VERSION@/#{version}/' docs/any.html > docs/_any.html"
  mv 'docs/_any.html', 'docs/any.html'
end
