"use client"

import type { Post } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, MapPin } from "lucide-react"
import { useState } from "react"
import { CommentInput } from "./comment-input"

interface PostCardProps {
  post: Post
  onLike: (postId: string) => void
  onComment: (postId: string, content: string) => void
  currentUserId: string
}

export function PostCard({ post, onLike, onComment, currentUserId }: PostCardProps) {
  const isLiked = post.likedBy.includes(currentUserId)
  const [showComments, setShowComments] = useState(false)

  const handleCommentSubmit = (content: string) => {
    onComment(post.id, content)
  }

  return (
    <Card className="overflow-hidden border-border bg-card">
      {/* User header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.username} />
          <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{post.user.username}</p>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{post.location.name}</span>
          </div>
        </div>
      </div>

      {/* Album cover and song info */}
      <div className="relative aspect-square w-full overflow-hidden bg-secondary">
        <img
          src={post.song.coverUrl || "/placeholder.svg"}
          alt={`${post.song.album} by ${post.song.artist}`}
          className="h-full w-full object-cover"
        />
        {/* Song info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
          <h3 className="text-lg font-bold text-white text-balance">{post.song.title}</h3>
          <p className="text-sm text-white/90">{post.song.artist}</p>
          <p className="text-xs text-white/70">{post.song.album}</p>
        </div>
      </div>

      {/* Caption and interactions */}
      <div className="p-4">
        {/* Action buttons */}
        <div className="mb-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2 px-2" onClick={() => onLike(post.id)}>
            <Heart className={`h-5 w-5 ${isLiked ? "fill-accent text-accent" : "text-foreground"}`} />
            <span className="text-sm font-medium">{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 px-2" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{post.comments.length}</span>
          </Button>
        </div>

        {/* Caption */}
        <p className="text-sm text-foreground">
          <span className="font-semibold">{post.user.username}</span>{" "}
          <span className="text-muted-foreground">{post.caption}</span>
        </p>

        {/* Timestamp */}
        <p className="mt-2 text-xs text-muted-foreground">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>

        {/* Comments section */}
        {showComments && (
          <div className="mt-4 space-y-3 border-t border-border pt-4">
            <CommentInput onSubmit={handleCommentSubmit} />

            {/* Existing comments */}
            {post.comments.length > 0 && (
              <div className="space-y-3">
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
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
