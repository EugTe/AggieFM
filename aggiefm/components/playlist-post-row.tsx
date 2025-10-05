"use client"

import type { Post } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, MapPin, Play } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CommentInput } from "./comment-input"

interface PlaylistPostRowProps {
  post: Post
  index: number
  onLike: (postId: string) => void
  onComment: (postId: string, content: string) => void
  currentUserId: string
}

export function PlaylistPostRow({ post, index, onLike, onComment, currentUserId }: PlaylistPostRowProps) {
  const isLiked = post.likedBy.includes(currentUserId)
  const [showDetails, setShowDetails] = useState(false)

  const handleCommentSubmit = (content: string) => {
    onComment(post.id, content)
  }

  return (
    <>
      <div
        className="group grid cursor-pointer grid-cols-[auto_3fr_2fr_2fr_1fr_auto] items-center gap-4 rounded-md px-4 py-2 transition-colors hover:bg-accent/5"
        onClick={() => setShowDetails(true)}
      >
        {/* Index/Play button */}
        <div className="flex w-8 items-center justify-center">
          <span className="text-sm text-muted-foreground group-hover:hidden">{index + 1}</span>
          <Play className="hidden h-4 w-4 fill-foreground text-foreground group-hover:block" />
        </div>

        {/* Album cover + Song info */}
        <div className="flex items-center gap-3">
          <img
            src={post.song.coverUrl || "/placeholder.svg"}
            alt={post.song.album}
            className="h-12 w-12 rounded object-cover"
          />
          <div className="min-w-0">
            <p className="truncate font-medium text-foreground">{post.song.title}</p>
            <p className="truncate text-sm text-muted-foreground">{post.song.artist}</p>
          </div>
        </div>

        {/* Album name */}
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{post.song.album}</p>
        </div>

        {/* User + Location */}
        <div className="flex min-w-0 items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.username} />
            <AvatarFallback className="text-xs">{post.user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-muted-foreground">{post.user.username}</p>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <p className="truncate text-xs text-muted-foreground">{post.location.name}</p>
            </div>
          </div>
        </div>

        {/* Likes */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 px-2"
          onClick={(e) => {
            e.stopPropagation()
            onLike(post.id)
          }}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-accent text-accent" : "text-muted-foreground"}`} />
          <span className="text-sm">{post.likes}</span>
        </Button>

        {/* Comments */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 px-2"
          onClick={(e) => {
            e.stopPropagation()
            setShowDetails(true)
          }}
        >
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{post.comments.length}</span>
        </Button>
      </div>

      {/* Post Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Post Details</DialogTitle>
            <DialogDescription className="sr-only">View post details and comments</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Album cover and song info */}
            <div className="flex gap-4">
              <img
                src={post.song.coverUrl || "/placeholder.svg"}
                alt={post.song.album}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-foreground">{post.song.title}</h3>
                <p className="text-lg text-muted-foreground">{post.song.artist}</p>
                <p className="text-sm text-muted-foreground">{post.song.album}</p>
              </div>
            </div>

            {/* User and location */}
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.username} />
                <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{post.user.username}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{post.location.name}</span>
                </div>
              </div>
            </div>

            {/* Caption */}
            {post.caption && (
              <div className="rounded-lg bg-secondary/50 p-3">
                <p className="text-sm text-foreground">{post.caption}</p>
              </div>
            )}

            {/* Likes and timestamp */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className={`h-4 w-4 ${isLiked ? "fill-accent text-accent" : ""}`} />
                <span>{post.likes} likes</span>
              </div>
              <span>
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Comments section */}
            <div className="space-y-3 border-t border-border pt-4">
              <h4 className="font-semibold text-foreground">Comments</h4>
              <CommentInput onSubmit={handleCommentSubmit} />

              {/* Existing comments */}
              {post.comments.length > 0 ? (
                <div className="max-h-64 space-y-3 overflow-y-auto">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.username} />
                        <AvatarFallback className="text-xs">{comment.user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">{comment.user.username}</span>{" "}
                          <span className="text-muted-foreground">{comment.content}</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground">No comments yet</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
