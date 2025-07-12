import { Glasses } from "lucide-react"

export function AuthLogo() {
    return (
        <div className="flex items-center justify-center mb-6">
            <div className="rounded-full bg-blue-600 p-3 shadow-md">
                <Glasses className="h-8 w-8 text-white" />
            </div>
        </div>
    )
}
