import { CampusMap } from "@/components/campus-map"
import { mockPosts, getCurrentUser } from "@/lib/mock-data"

export default function MapPage() {
  const currentUser = getCurrentUser()

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="z-40 border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Campus Map</h1>
            <p className="text-sm text-muted-foreground">Explore music across UC Davis</p>
          </div>
          <span className="text-sm text-muted-foreground">@{currentUser.username}</span>
        </div>
      </header>

      {/* Map */}
      <main className="flex-1 overflow-hidden">
        <CampusMap posts={mockPosts} currentUserId={currentUser.id} />
      </main>
    </div>
  )
}
