class User < ApplicationRecord
  has_many :songs, dependent: :destroy

  validates :email, presence: true, 
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: "must be a valid email address" }
  validates :name, presence: true, length: { minimum: 2, maximum: 200 }
end
