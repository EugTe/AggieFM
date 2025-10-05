"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface CommentInputProps {
  onSubmit: (content: string) => void
}

export function CommentInput({ onSubmit }: CommentInputProps) {
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      onSubmit(comment.trim())
      setComment("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={!comment.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
