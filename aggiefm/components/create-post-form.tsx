"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CAMPUS_LOCATIONS } from "@/lib/types"
import { Music, MapPin } from "lucide-react"

export function CreatePostForm() {
  const router = useRouter()
  const [spotifyLink, setSpotifyLink] = useState("")
  const [caption, setCaption] = useState("")
  const [locationId, setLocationId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    console.log("[v0] Creating post:", {
      spotifyLink,
      caption,
      locationId,
    })

    router.push("/")
  }

  const isFormValid = spotifyLink && caption && locationId

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Music className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Song Details</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spotify-link">Spotify Link or ID</Label>
            <Input
              id="spotify-link"
              placeholder="Paste Spotify song link or ID"
              value={spotifyLink}
              onChange={(e) => setSpotifyLink(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Example: https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b
            </p>
          </div>
        </div>
      </Card>

      {/* Caption */}
      <Card className="p-6">
        <div className="space-y-2">
          <Label htmlFor="caption">Caption</Label>
          <Textarea
            id="caption"
            placeholder="Share what this song means to you..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={4}
            required
          />
          <p className="text-xs text-muted-foreground">{caption.length}/280 characters</p>
        </div>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Location</h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Where are you on campus?</Label>
          <Select value={locationId} onValueChange={setLocationId} required>
            <SelectTrigger id="location" className="bg-card">
              <SelectValue placeholder="Select a location" />
            </SelectTrigger>
            <SelectContent className="bg-card">
              {CAMPUS_LOCATIONS.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={!isFormValid}>
        Share Your Song
      </Button>

      <p className="text-center text-sm text-muted-foreground">You can share one song per day</p>
    </form>
  )
}
