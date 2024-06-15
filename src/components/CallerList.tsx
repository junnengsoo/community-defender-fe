import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Header from "./Header"

const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

export default function CallerList() {
    return (
        <div className="h-screen">
            <Header />
            <ScrollArea className="h-full w-full rounded-md border">
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
