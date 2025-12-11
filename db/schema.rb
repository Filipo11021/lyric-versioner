# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_11_24_181027) do
  create_table "branches", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "head_commit_id"
    t.string "name", null: false
    t.integer "song_id", null: false
    t.datetime "updated_at", null: false
    t.index ["head_commit_id"], name: "index_branches_on_head_commit_id"
    t.index ["song_id", "name"], name: "index_branches_on_song_id_and_name", unique: true
    t.index ["song_id"], name: "index_branches_on_song_id"
  end

  create_table "commits", force: :cascade do |t|
    t.string "author_name", null: false
    t.text "content", null: false
    t.datetime "created_at", null: false
    t.string "message", null: false
    t.integer "parent_commit_id"
    t.integer "song_id", null: false
    t.datetime "timestamp", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_commit_id"], name: "index_commits_on_parent_commit_id"
    t.index ["song_id"], name: "index_commits_on_song_id"
  end

  create_table "songs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_songs_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "branches", "commits", column: "head_commit_id"
  add_foreign_key "branches", "songs"
  add_foreign_key "commits", "commits", column: "parent_commit_id"
  add_foreign_key "commits", "songs"
  add_foreign_key "songs", "users"
end
