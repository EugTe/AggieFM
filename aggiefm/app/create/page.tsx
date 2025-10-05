import { CreatePostForm } from "@/components/create-post-form"
import { getCurrentUser } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CreatePage() {
  const currentUser = getCurrentUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Share a Song</h1>
              <p className="text-sm text-muted-foreground">Post your daily track</p>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">@{currentUser.username}</span>
        </div>
      </header>

      {/* Form */}
      <main className="mx-auto max-w-2xl px-6 py-6">
        <CreatePostForm />
      </main>
    </div>
  )
}
