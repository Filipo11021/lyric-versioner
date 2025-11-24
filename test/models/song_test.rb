require "test_helper"

class SongTest < ActiveSupport::TestCase
  test "should create main branch after song creation" do
    user = users(:one)
    song = Song.create!(title: "New Song", user: user)
    
    assert song.branches.exists?(name: "main"), "Main branch should be created"
    assert_equal 1, song.branches.count
  end
end
