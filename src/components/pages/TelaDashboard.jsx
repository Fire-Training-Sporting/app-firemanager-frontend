import Header from "../utils/Header"
import { Dashboard } from "../utils/Dashboard/Dashboard"

export function TelaDashboard() {
    return (
        <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
            <Header></Header>
            <Dashboard></Dashboard>
        </div>
    )
}