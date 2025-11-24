class CreateBranches < ActiveRecord::Migration[8.1]
  def change
    create_table :branches do |t|
      t.references :song, null: false, foreign_key: true
      t.string :name, null: false
      t.index [:song_id, :name], unique: true

      t.timestamps
    end
  end
end
