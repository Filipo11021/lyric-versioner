# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "Cleaning database..."

# Break circular dependencies or self-referential constraints
Branch.update_all(head_commit_id: nil)
Commit.update_all(parent_commit_id: nil)

Branch.destroy_all
Commit.destroy_all
Song.destroy_all
User.destroy_all

puts "Creating users..."
user1 = User.create!(email: 'artist@example.com', name: 'The Artist')
user2 = User.create!(email: 'collab@example.com', name: 'Collaborator')

# --- Song 1 ---
puts "Creating Song 1: Midnight Echoes..."
song1 = Song.create!(title: 'Midnight Echoes', user: user1)

# Initial commit
commit1_1 = Commit.create!(
  song: song1,
  parent_commit: nil,
  message: 'Initial draft',
  content: "Verse 1:\nWalking down the empty street\nNeon lights beneath my feet\n\nChorus:\nMidnight echoes calling me\nTo a place I want to be",
  author_name: user1.name,
  timestamp: 2.days.ago
)

# Main branch points to this initial commit
main_branch1 = Branch.create!(song: song1, name: 'main', head_commit: commit1_1)

# Second commit on main
commit1_2 = Commit.create!(
  song: song1,
  parent_commit: commit1_1,
  message: 'Add second verse',
  content: "Verse 1:\nWalking down the empty street\nNeon lights beneath my feet\n\nVerse 2:\nShadows dancing on the wall\nWaiting for the morning call\n\nChorus:\nMidnight echoes calling me\nTo a place I want to be",
  author_name: user1.name,
  timestamp: 1.day.ago
)

main_branch1.update!(head_commit: commit1_2)

# Feature branch
commit1_feature = Commit.create!(
  song: song1,
  parent_commit: commit1_1,
  message: 'Experimental bridge',
  content: "Verse 1:\nWalking down the empty street\nNeon lights beneath my feet\n\nChorus:\nMidnight echoes calling me\nTo a place I want to be\n\nBridge:\nTime stands still...",
  author_name: user2.name,
  timestamp: 1.day.ago
)

Branch.create!(song: song1, name: 'experiment-bridge', head_commit: commit1_feature)


# --- Song 2 ---
puts "Creating Song 2: Neon Sky..."
song2 = Song.create!(title: 'Neon Sky', user: user2)

commit2_1 = Commit.create!(
  song: song2,
  parent_commit: nil,
  message: 'Beat idea',
  content: "[Intro]\nSynth heavy beat, 120 BPM\n\n[Verse 1]\nDriving through the neon sky\nWatching all the world go by",
  author_name: user2.name,
  timestamp: 5.days.ago
)

main_branch2 = Branch.create!(song: song2, name: 'main', head_commit: commit2_1)

commit2_2 = Commit.create!(
  song: song2,
  parent_commit: commit2_1,
  message: 'Added chorus lyrics',
  content: "[Intro]\nSynth heavy beat, 120 BPM\n\n[Verse 1]\nDriving through the neon sky\nWatching all the world go by\n\n[Chorus]\nWe are electric, we are alive\nIn the neon sky, we survive",
  author_name: user2.name,
  timestamp: 4.days.ago
)

main_branch2.update!(head_commit: commit2_2)


# --- Song 3 ---
puts "Creating Song 3: Acoustic Morning..."
song3 = Song.create!(title: 'Acoustic Morning', user: user1)

commit3_1 = Commit.create!(
  song: song3,
  parent_commit: nil,
  message: 'Chords and melody',
  content: "Key: G Major\nChords: G - C - D - Em\n\nLyrics:\nSun comes up over the hill\nWorld is quiet, world is still",
  author_name: user1.name,
  timestamp: 1.week.ago
)

main_branch3 = Branch.create!(song: song3, name: 'main', head_commit: commit3_1)

# A branch where lyrics were rewritten
commit3_rewrite = Commit.create!(
  song: song3,
  parent_commit: commit3_1,
  message: 'Rewrite lyrics to be darker',
  content: "Key: G Minor\nChords: Gm - Cm - D7 - Eb\n\nLyrics:\nRain comes down against the pane\nWashing away all the pain",
  author_name: user1.name,
  timestamp: 3.days.ago
)

Branch.create!(song: song3, name: 'dark-version', head_commit: commit3_rewrite)


puts "Seeding done!"
puts "Created #{User.count} users"
puts "Created #{Song.count} songs"
puts "Created #{Branch.count} branches"
puts "Created #{Commit.count} commits"
