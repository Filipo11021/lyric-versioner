class Song < ApplicationRecord
  belongs_to :user
  has_many :branches, dependent: :destroy
  has_many :commits, dependent: :destroy

  validates :title, presence: true, length: { minimum: 1, maximum: 200 }
  validates :user, presence: true

  after_create :create_main_branch

  def default_branch
    branches.find_by(name: 'main')
  end

  def latest_commit
    commits.order(timestamp: :desc).first
  end

  private

  def create_main_branch
    branches.create!(name: 'main')
  end
end
