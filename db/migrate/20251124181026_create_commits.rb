class CreateCommits < ActiveRecord::Migration[8.1]
  def change
    create_table :commits do |t|
      t.references :song, null: false, foreign_key: true
      t.references :parent_commit, null: true, foreign_key: { to_table: :commits }
      t.string :message, null: false
      t.text :content, null: false
      t.string :author_name, null: false
      t.datetime :timestamp, null: false

      t.timestamps
    end
  end
end
