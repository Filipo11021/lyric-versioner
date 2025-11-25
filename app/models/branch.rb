class Branch < ApplicationRecord
  belongs_to :song
  belongs_to :head_commit, class_name: 'Commit', optional: true

  validates :name, presence: true, 
                   uniqueness: { scope: :song_id, message: "already exists for this song" },
                   length: { minimum: 1, maximum: 100 }
  validates :song, presence: true

  def commit(message:, content:, author_name:)
    transaction do
      new_commit = Commit.create!(
        song: song,
        parent_commit: head_commit,
        message: message,
        content: content,
        author_name: author_name,
        timestamp: Time.current
      )
      update!(head_commit: new_commit)
      new_commit
    end
  end

  def history
    commits = []
    current = head_commit
    while current
      commits << current
      current = current.parent_commit
    end
    commits
  end
end
