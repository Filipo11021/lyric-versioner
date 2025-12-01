# Pin npm packages by running ./bin/importmap

pin "application"
pin "@hotwired/turbo-rails", to: "turbo.min.js"
pin "@hotwired/stimulus", to: "stimulus.min.js"
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js"

Dir.glob("app/javascript/*").each do |path|
  next unless File.directory?(path)
  dir_name = File.basename(path)
  pin_all_from path, under: dir_name
end
