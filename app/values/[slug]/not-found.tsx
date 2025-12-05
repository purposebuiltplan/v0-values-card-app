import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Summary not found</h1>
        <p className="text-muted-foreground">We couldn't find the values summary you're looking for.</p>
        <Button asChild>
          <Link href="/">Start your own values exercise</Link>
        </Button>
      </div>
    </div>
  )
}
