class AddHeadCommitToBranches < ActiveRecord::Migration[8.1]
  def change
    add_reference :branches, :head_commit, null: true, foreign_key: { to_table: :commits }
  end
end
