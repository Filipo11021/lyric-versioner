class Branch < ApplicationRecord
  belongs_to :song
  belongs_to :head_commit, class_name: 'Commit', optional: true

  validates :name, presence: true, 
                   uniqueness: { scope: :song_id, message: "already exists for this song" },
                   length: { minimum: 1, maximum: 100 }
  validates :song, presence: true
end
