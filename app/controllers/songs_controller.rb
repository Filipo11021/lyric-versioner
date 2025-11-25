class SongsController < ApplicationController
  def index
    @songs = Song.all
  end

  def show
    @song = Song.find(params[:id])
    @branch_name = params[:branch].presence || "main"
    @current_branch = @song.branches.find_by(name: @branch_name)

    if @current_branch.nil?
      redirect_to song_path(@song, branch: "main"), alert: "Branch not found"
      return
    end

    @commits = @current_branch.history
    @branches = @song.branches
    @current_content = @current_branch.head_commit&.content || ""
  end

  def update
    @song = Song.find(params[:id])
    @branch_name = params[:branch].presence || "main"
    @current_branch = @song.branches.find_by(name: @branch_name)

    if @current_branch
      @current_branch.commit(
        message: "Saved version",
        content: params[:content],
        author_name: "You"
      )
      redirect_to song_path(@song, branch: @branch_name), notice: "Version saved!"
    else
      redirect_to song_path(@song), alert: "Branch not found"
    end
  end
end
