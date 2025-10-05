"use client"

import { useState, useEffect } from "react"
import type { Post, Location, Comment } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Play, Pause, SkipBack, SkipForward, ListMusic, Heart, MessageCircle, Send } from "lucide-react"
import { getCurrentUser } from "@/lib/mock-data"
import dynamic from "next/dynamic"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })

interface CampusMapProps {
  posts: Post[]
  currentUserId: string
}

interface LocationWithPosts extends Location {
  posts: Post[]
}

export function CampusMap({ posts: initialPosts, currentUserId }: CampusMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationWithPosts | null>(null)
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)
  const [currentPostIndex, setCurrentPostIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentInput, setCommentInput] = useState("")
  const [rotatingCommentIndex, setRotatingCommentIndex] = useState(0)

  useEffect(() => {
    setIsClient(true)
    import("leaflet").then((leaflet) => {
      setL(leaflet.default)
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      })
    })
  }, [])

  useEffect(() => {
    if (selectedLocation && !showQueue && !showComments) {
      const currentPost = selectedLocation.posts[currentPostIndex]
      if (currentPost.comments.length > 0) {
        const interval = setInterval(() => {
          setRotatingCommentIndex((prev) => (prev + 1) % currentPost.comments.length)
        }, 1000)
        return () => clearInterval(interval)
      }
    }
  }, [selectedLocation, currentPostIndex, showQueue, showComments])

  // Group posts by location
  const locationMap = new Map<string, LocationWithPosts>()
  posts.forEach((post) => {
    const locationId = post.location.id
    if (!locationMap.has(locationId)) {
      locationMap.set(locationId, {
        ...post.location,
        posts: [],
      })
    }
    locationMap.get(locationId)!.posts.push(post)
  })

  const locationsWithPosts = Array.from(locationMap.values())

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

  const handleCommentSubmit = () => {
    if (commentInput.trim() && selectedLocation) {
      const currentPost = selectedLocation.posts[currentPostIndex]
      handleComment(currentPost.id, commentInput)
      setCommentInput("")
    }
  }

  const createCustomIcon = (location: LocationWithPosts) => {
    if (!L) return null

    const topPost = location.posts.sort((a, b) => b.likes - a.likes)[0]
    const count = location.posts.length

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="relative flex flex-col items-center gap-1 group cursor-pointer">
          <div class="relative h-16 w-16 overflow-hidden rounded-xl border-4 border-white shadow-xl transition-transform group-hover:scale-110">
            <div style="background: url('${topPost.song.coverUrl}') center/cover; width: 100%; height: 100%;"></div>
          </div>
          <div class="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-lg whitespace-nowrap border-2 border-gray-200">
            ${location.name} (${count})
          </div>
        </div>
      `,
      iconSize: [64, 64],
      iconAnchor: [32, 64],
    })
  }

  const campusCenter: [number, number] = [38.5382, -121.7617]

  const handlePrevious = () => {
    if (selectedLocation && currentPostIndex > 0) {
      setCurrentPostIndex(currentPostIndex - 1)
      setRotatingCommentIndex(0)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNext = () => {
    if (selectedLocation && currentPostIndex < selectedLocation.posts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1)
      setRotatingCommentIndex(0)
    }
  }

  const handleQueueClick = () => {
    setShowQueue(!showQueue)
    setShowComments(false)
  }

  const handlePostSelect = (index: number) => {
    setCurrentPostIndex(index)
    setIsPlaying(false)
    setRotatingCommentIndex(0)
  }

  if (!isClient || !L) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-secondary">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    )
  }

  const currentPost = selectedLocation?.posts[currentPostIndex]
  const isLiked = currentPost?.likedBy.includes(currentUserId)

  return (
    <div className="relative h-full w-full">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
      <style jsx global>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          background: #f5f5f7;
        }
        .leaflet-tile {
          filter: none;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          background: oklch(var(--card));
          color: oklch(var(--foreground));
          border-radius: 0.5rem;
          padding: 0;
        }
        .leaflet-popup-tip {
          background: oklch(var(--card));
        }
        .leaflet-control-zoom a {
          background: white !important;
          color: #1d1d1f !important;
          border-color: #d2d2d7 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f5f5f7 !important;
        }
        .leaflet-control-attribution {
          background: rgba(255, 255, 255, 0.8) !important;
          color: #86868b !important;
        }
        .leaflet-control-attribution a {
          color: #0071e3 !important;
        }
        .leaflet-overlay-pane svg {
          display: none;
        }
      `}</style>

      <MapContainer center={campusCenter} zoom={15} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locationsWithPosts.map((location) => (
          <Marker
            key={location.id}
            position={[location.coordinates.lat, location.coordinates.lng]}
            icon={createCustomIcon(location)}
            eventHandlers={{
              click: () => {
                setSelectedLocation(location)
                setCurrentPostIndex(0)
                setShowQueue(false)
                setIsPlaying(false)
                setShowComments(false)
                setRotatingCommentIndex(0)
              },
            }}
          />
        ))}
      </MapContainer>

      {selectedLocation && currentPost && (
        <div className="absolute inset-0 z-[1000] flex items-end justify-center bg-black/30 backdrop-blur-sm">
          <Card className="w-full max-w-4xl overflow-hidden rounded-b-none rounded-t-2xl border-x-0 border-b-0 shadow-2xl">
            {!showQueue ? (
              <div className="flex bg-gradient-to-b from-card to-secondary/20">
                <div className="flex-1 p-6">
                  <div className="mb-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setSelectedLocation(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-6 flex justify-center">
                    <div className="relative h-64 w-64 overflow-hidden rounded-2xl shadow-2xl">
                      <img
                        src={currentPost.song.coverUrl || "/placeholder.svg"}
                        alt={currentPost.song.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="mb-2 space-y-1 text-center">
                    <h3 className="text-xl font-semibold text-foreground">{currentPost.song.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentPost.song.artist}</p>
                    <p className="text-xs text-muted-foreground">{currentPost.song.album}</p>
                  </div>

                  <div className="mb-6 space-y-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <img
                        src={currentPost.user.avatar || "/placeholder.svg"}
                        alt={currentPost.user.username}
                        className="h-6 w-6 rounded-full"
                      />
                      <span className="text-sm font-medium text-foreground">{currentPost.user.username}</span>
                    </div>
                    {currentPost.caption && <p className="text-sm text-muted-foreground">"{currentPost.caption}"</p>}
                  </div>

                  {currentPost.comments.length > 0 && !showComments && (
                    <div className="mb-4 rounded-lg bg-accent/30 p-3 text-center">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">{currentPost.comments[rotatingCommentIndex].user.username}:</span>{" "}
                        {currentPost.comments[rotatingCommentIndex].content}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12"
                      onClick={handlePrevious}
                      disabled={currentPostIndex === 0}
                    >
                      <SkipBack className="h-6 w-6" />
                    </Button>

                    <Button
                      variant="default"
                      size="icon"
                      className="h-16 w-16 rounded-full shadow-lg"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="ml-1 h-7 w-7" />}
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12"
                      onClick={handleNext}
                      disabled={currentPostIndex === selectedLocation.posts.length - 1}
                    >
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex gap-4">
                      <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleLike(currentPost.id)}>
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        {currentPost.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => setShowComments(!showComments)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        {currentPost.comments.length}
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2" onClick={handleQueueClick}>
                      <ListMusic className="h-4 w-4" />
                      Queue ({selectedLocation.posts.length})
                    </Button>
                  </div>
                </div>

                {showComments && (
                  <div className="w-96 border-l border-border bg-card">
                    <div className="flex items-center justify-between border-b border-border p-4">
                      <h3 className="font-semibold text-foreground">Comments</h3>
                      <Button variant="ghost" size="icon" onClick={() => setShowComments(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="max-h-[calc(80vh-200px)] space-y-4 overflow-y-auto p-4">
                      {currentPost.comments.map((comment) => (
                        <div key={comment.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <img
                              src={comment.user.avatar || "/placeholder.svg"}
                              alt={comment.user.username}
                              className="h-6 w-6 rounded-full"
                            />
                            <span className="text-sm font-medium text-foreground">{comment.user.username}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.content}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a comment..."
                          value={commentInput}
                          onChange={(e) => setCommentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCommentSubmit()
                            }
                          }}
                        />
                        <Button size="icon" onClick={handleCommentSubmit}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-h-[80vh] bg-card">
                <div className="flex items-center justify-between border-b border-border bg-card p-4">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{selectedLocation.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedLocation.posts.length} posts</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleQueueClick}>
                      <X className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedLocation(null)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="max-h-[calc(80vh-80px)] overflow-y-auto">
                  {selectedLocation.posts.map((post, index) => (
                    <button
                      key={post.id}
                      onClick={() => handlePostSelect(index)}
                      className={`flex w-full items-center gap-3 border-b border-border/50 p-3 text-left transition-colors hover:bg-accent/50 ${
                        index === currentPostIndex ? "bg-accent/30" : ""
                      }`}
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                        <img
                          src={post.song.coverUrl || "/placeholder.svg"}
                          alt={post.song.name}
                          className="h-full w-full object-cover"
                        />
                        {index === currentPostIndex && isPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <Play className="h-5 w-5 text-white" fill="white" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{post.song.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{post.song.artist}</p>
                      </div>

                      <img
                        src={post.user.avatar || "/placeholder.svg"}
                        alt={post.user.username}
                        className="h-8 w-8 rounded-full"
                      />

                      <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                        <span>{post.likes} likes</span>
                        <span>{post.comments.length} comments</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}
