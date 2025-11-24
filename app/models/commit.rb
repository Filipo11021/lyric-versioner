class Commit < ApplicationRecord
  belongs_to :song
  belongs_to :parent_commit, class_name: 'Commit', optional: true
  has_many :child_commits, class_name: 'Commit', foreign_key: 'parent_commit_id', dependent: :nullify
  has_many :branches_where_head, class_name: 'Branch', foreign_key: 'head_commit_id', dependent: :nullify

  validates :song, presence: true
  validates :message, presence: true, length: { minimum: 1, maximum: 500 }
  validates :content, presence: true
  validates :author_name, presence: true, length: { minimum: 1, maximum: 100 }
  validates :timestamp, presence: true
  
  validate :parent_commit_must_belong_to_same_song

  private

  def parent_commit_must_belong_to_same_song
    if parent_commit.present? && parent_commit.song_id != song_id
      errors.add(:parent_commit, "must belong to the same song")
    end
  end
end
