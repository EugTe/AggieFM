export interface User {
  id: string
  username: string
  avatar?: string
  createdAt: Date
}

export interface Song {
  name: string
  artist: string
  album: string
  coverUrl: string
  spotifyUrl?: string
}

export interface Location {
  id: string
  name: string // Building name or location on UC Davis campus
  coordinates: {
    lat: number
    lng: number
  }
}

export interface Post {
  id: string
  userId: string
  user: User
  song: Song
  caption: string
  location: Location
  likes: number
  likedBy: string[] // Array of user IDs who liked this post
  comments: Comment[]
  createdAt: Date
}

export interface Comment {
  id: string
  userId: string
  user: User
  postId: string
  content: string
  createdAt: Date
}

// UC Davis campus locations
export const CAMPUS_LOCATIONS: Location[] = [
  {
    id: "mem-union",
    name: "Memorial Union",
    coordinates: { lat: 38.542, lng: -121.749 },
  },
  {
    id: "shields-library",
    name: "Shields Library",
    coordinates: { lat: 38.5394, lng: -121.7494 },
  },
  {
    id: "arc",
    name: "Activities and Recreation Center",
    coordinates: { lat: 38.5376, lng: -121.7575 },
  },
  {
    id: "silo",
    name: "The Silo",
    coordinates: { lat: 38.5404, lng: -121.7515 },
  },
  {
    id: "tercero",
    name: "Tercero Residence Halls",
    coordinates: { lat: 38.5355, lng: -121.7625 },
  },
  {
    id: "segundo",
    name: "Segundo Residence Halls",
    coordinates: { lat: 38.5425, lng: -121.7545 },
  },
  {
    id: "cuarto",
    name: "Cuarto Residence Halls",
    coordinates: { lat: 38.5335, lng: -121.7395 },
  },
  {
    id: "sciences-lab",
    name: "Sciences Laboratory Building",
    coordinates: { lat: 38.5365, lng: -121.7515 },
  },
  {
    id: "wellman-hall",
    name: "Wellman Hall",
    coordinates: { lat: 38.5385, lng: -121.7505 },
  },
  {
    id: "coho",
    name: "CoHo (Coffee House)",
    coordinates: { lat: 38.542, lng: -121.7505 },
  },
]
