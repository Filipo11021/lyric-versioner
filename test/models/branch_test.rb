require "test_helper"

class BranchTest < ActiveSupport::TestCase
  test "commit action creates a new commit and updates head" do
    song = songs(:one)
    branch = branches(:one)

    original_head = branch.head_commit
    
    new_commit = branch.commit(
      message: "New changes",
      content: "Updated lyrics",
      author_name: "Tester"
    )
    

    assert_instance_of Commit, new_commit
    assert_equal "New changes", new_commit.message
    assert_equal "Updated lyrics", new_commit.content
    assert_equal "Tester", new_commit.author_name
    assert_equal song, new_commit.song
    assert_equal original_head, new_commit.parent_commit
    

    branch.reload
    assert_equal new_commit, branch.head_commit
  end

  test "commit action handles first commit when no head exists" do
    song = songs(:two)
    branch = Branch.create!(song: song, name: "feature-branch")
    
    assert_nil branch.head_commit
    
    new_commit = branch.commit(
      message: "Initial commit",
      content: "Start",
      author_name: "Tester"
    )
    
    assert_instance_of Commit, new_commit
    assert_nil new_commit.parent_commit
    
    branch.reload
    assert_equal new_commit, branch.head_commit
  end
end
