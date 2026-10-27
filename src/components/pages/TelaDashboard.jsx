import Header from "../utils/Header"
import { Dashboard } from "../utils/Dashboard/Dashboard"

export function TelaDashboard() {
    return (
        <div className="flex min-h-screen flex-col bg-[#f1f5f9]">
            <Header></Header>
            <Dashboard></Dashboard>
        </div>
    )
}