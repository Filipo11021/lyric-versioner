# frozen_string_literal: true

return puts "Seeds skipped (#{Rails.env})" unless Rails.env.development?

puts "Seeding..."

user = User.find_or_create_by!(email: "demo@example.com") do |u|
  u.password = "password"
end

if user.songs.exists?
  puts "User already has songs, skipping"
else
  song1 = user.songs.create!(title: "Midnight Echoes")
  main1 = song1.default_branch

  main1.commit(
    message: "Initial draft",
    content: "Verse 1:\nWalking down the empty street\nNeon lights beneath my feet\n\nChorus:\nMidnight echoes calling me",
    author_name: user.email
  )

  main1.commit(
    message: "Add second verse",
    content: "Verse 1:\nWalking down the empty street\nNeon lights beneath my feet\n\nVerse 2:\nShadows dancing on the wall\nWaiting for the morning call\n\nChorus:\nMidnight echoes calling me",
    author_name: user.email
  )

  song1.branches.create!(name: "experiment", head_commit: main1.history.last).commit(
    message: "Try new bridge",
    content: "Verse 1:\nWalking down the empty street\n\nBridge:\nTime stands still...\n\nChorus:\nMidnight echoes calling me",
    author_name: user.email
  )

  song2 = user.songs.create!(title: "Neon Sky")
  main2 = song2.default_branch

  main2.commit(
    message: "Beat idea",
    content: "[Intro]\n120 BPM synth\n\n[Verse]\nDriving through the neon sky",
    author_name: user.email
  )

  main2.commit(
    message: "Add chorus",
    content: "[Intro]\n120 BPM synth\n\n[Verse]\nDriving through the neon sky\n\n[Chorus]\nWe are electric, we are alive",
    author_name: user.email
  )

  song3 = user.songs.create!(title: "Acoustic Morning")
  main3 = song3.default_branch

  main3.commit(
    message: "First draft",
    content: "Key: G Major\n\nSun comes up over the hill\nWorld is quiet, world is still",
    author_name: user.email
  )

  song3.branches.create!(name: "dark-version", head_commit: main3.head_commit).commit(
    message: "Dark rewrite",
    content: "Key: G Minor\n\nRain comes down against the pane\nWashing away all the pain",
    author_name: user.email
  )

  puts "Created #{user.songs.count} songs"
end

puts "Done! Login: demo@example.com / password"
