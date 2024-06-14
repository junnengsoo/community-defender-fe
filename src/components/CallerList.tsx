import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export default function CallerList() {
    return (
        <div className="px-1">
            <header className="bg-white shadow p-4">
                <h1 className="text-l font-semibold">CommunityDefenders</h1>
            </header>
            <ScrollArea className="h-80 rounded-md border">
                <div className="p-4">
                <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                    {tags.map((tag) => (
                        <>
                        <div key={tag} className="text-sm">
                        {tag}
                        </div>
                        <Separator className="my-2" />
                        </>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
