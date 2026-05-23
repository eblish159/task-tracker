import { NavLink, Outlet } from "react-router-dom";
import "./AppLayout.css";

export default function AppLayout() {
    return (
        <div className="layout">
            <aside className="sidebar">
                <h1>Tracker</h1>

                <nav>
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/tasks" end>Tasks</NavLink>
                    <NavLink to="/tasks/new">New Task</NavLink>
                </nav>
            </aside>

            <main>
                <Outlet />
            </main>
        </div>
    );
}