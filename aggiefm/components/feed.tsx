"use client"

import { useState, useMemo } from "react"
import type { Post, Comment } from "@/lib/types"
import { PlaylistPostRow } from "./playlist-post-row"
import { getCurrentUser, mockPosts } from "@/lib/mock-data"
import { Heart, MessageCircle, Search, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CAMPUS_LOCATIONS } from "@/lib/types"

interface FeedProps {
  initialPosts: Post[]
  currentUserId: string
}

type SortOption = "title" | "likes" | "location"

export function Feed({ initialPosts, currentUserId }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [sortBy, setSortBy] = useState<SortOption>("title")
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [showLocationSearch, setShowLocationSearch] = useState(false)

  const sortedAndFilteredPosts = useMemo(() => {
    let filtered = [...posts]

    // Filter by location if selected
    if (selectedLocation) {
      filtered = filtered.filter((post) => post.location.id === selectedLocation)
    }

    // Sort posts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.song.name.localeCompare(b.song.name)
        case "likes":
          return b.likes - a.likes
        case "location":
          return a.location.name.localeCompare(b.location.name)
        default:
          return 0
      }
    })

    return filtered
  }, [posts, sortBy, selectedLocation])

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = post.likedBy.includes(currentUserId)
          return {
            ...post,
            likes: isLiked ? post.likes - 1 : post.likes + 1,
            likedBy: isLiked ? post.likedBy.filter((id) => id !== currentUserId) : [...post.likedBy, currentUserId],
          }
        }
        return post
      }),
    )
  }

  const handleComment = (postId: string, content: string) => {
    const currentUser = getCurrentUser()
    const newComment: Comment = {
      id: `c${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      postId,
      content,
      createdAt: new Date(),
    }

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          }
        }
        return post
      }),
    )
  }

  const locationCounts = useMemo(() => {
    const counts = new Map<string, number>()
    mockPosts.forEach((post) => {
      const count = counts.get(post.location.id) || 0
      counts.set(post.location.id, count + 1)
    })
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id]) => CAMPUS_LOCATIONS.find((loc) => loc.id === id)!)
      .filter(Boolean)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-border px-4 pb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by location..."
            className="pl-9"
            value={selectedLocation ? CAMPUS_LOCATIONS.find((l) => l.id === selectedLocation)?.name : ""}
            onFocus={() => setShowLocationSearch(true)}
            readOnly
          />
          {showLocationSearch && (
            <div className="absolute top-full z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              <button
                onClick={() => {
                  setSelectedLocation(null)
                  setShowLocationSearch(false)
                }}
                className="w-full border-b border-border px-4 py-2 text-left text-sm hover:bg-accent"
              >
                All Locations
              </button>
              {locationCounts.map((location) => (
                <button
                  key={location.id}
                  onClick={() => {
                    setSelectedLocation(location.id)
                    setShowLocationSearch(false)
                  }}
                  className="w-full border-b border-border px-4 py-2 text-left text-sm hover:bg-accent"
                >
                  {location.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowUpDown className="h-4 w-4" />
              Sort by: {sortBy === "title" ? "Title" : sortBy === "likes" ? "Likes" : "Location"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("title")}>Title</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("likes")}>Likes</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("location")}>Location</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1">
        <div className="grid grid-cols-[auto_3fr_2fr_2fr_1fr_auto] items-center gap-4 border-b border-border px-4 py-3 text-sm font-medium text-muted-foreground">
          <div className="w-8 text-center">#</div>
          <div>Title</div>
          <div>Album</div>
          <div>Posted By</div>
          <div className="text-center">
            <Heart className="mx-auto h-4 w-4" />
          </div>
          <div className="text-center">
            <MessageCircle className="mx-auto h-4 w-4" />
          </div>
        </div>

        {sortedAndFilteredPosts.map((post, index) => (
          <PlaylistPostRow
            key={post.id}
            post={post}
            index={index}
            onLike={handleLike}
            onComment={handleComment}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  )
}
