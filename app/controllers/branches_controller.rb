class BranchesController < ApplicationController
  def create
    @song = Song.find(params[:song_id])
    source_branch = @song.branches.find_by(name: params[:source_branch])

    if source_branch
      @branch = @song.branches.new(name: params[:name], head_commit: source_branch.head_commit)

      if @branch.save
        redirect_to song_path(@song, branch: @branch.name), notice: "Branch created successfully!"
      else
        redirect_to song_path(@song, branch: params[:source_branch]), alert: "Failed to create branch: #{@branch.errors.full_messages.join(', ')}"
      end
    else
      redirect_to song_path(@song), alert: "Source branch not found"
    end
  end
end
