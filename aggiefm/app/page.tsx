import { Feed } from "@/components/feed"
import { mockPosts, getCurrentUser } from "@/lib/mock-data"

export default function Home() {
  const currentUser = getCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Feed</h1>
            <p className="text-sm text-muted-foreground">Latest music from UC Davis</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">@{currentUser.username}</span>
          </div>
        </div>
      </header>

      <div className="px-6 py-6">
        <Feed initialPosts={mockPosts} currentUserId={currentUser.id} />
      </div>
    </div>
  )
}
