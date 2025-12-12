class SongsController < ApplicationController
  def index
    @songs = current_user.songs
  end

  def show
    @song = current_user.songs.find(params[:id])
    @current_branch_name = params[:branch].presence || "main"
    @current_branch = @song.branches.find_by(name: @current_branch_name)

    if @current_branch.nil?
      redirect_to song_path(@song, branch: "main"), alert: "Branch not found"
      return
    end

    @commits = @current_branch.history
    @branches = @song.branches
    @current_content = @current_branch.head_commit&.content || ""
  end

  def update
    @song = current_user.songs.find(params[:id])
    if @song.blank?
      redirect_to songs_path, alert: "Song not found"
      return
    end

    @current_branch_name = params[:branch].presence
    if @current_branch_name.blank?
      redirect_to song_path(@song), alert: "Branch not found"
      return
    end

    @current_branch = @song.branches.find_by(name: @current_branch_name)

    if @current_branch
      @current_branch.commit(
        message: params[:commit_message].presence || "Saved version",
        content: params[:content],
        author_name: "You"
      )
      redirect_to song_path(@song, branch: @current_branch_name), notice: "Version saved!"
    else
      redirect_to song_path(@song), alert: "Branch not found"
    end
  end

  def create
    @song = current_user.songs.build(create_song_params)
    if @song.save
      redirect_to song_path(@song), status: :see_other
    else
      render turbo_stream: turbo_stream.replace("new_song_form", partial: "songs/new_song_form", locals: { song: @song }), status: :unprocessable_entity
    end
  end

  def destroy
    @song = current_user.songs.find_by(id: params[:id])
    @song&.destroy
    redirect_to songs_path, status: :see_other
  end

  private

  def create_song_params
    params.require(:song).permit(:title)
  end
end
