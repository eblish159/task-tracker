import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AppLayout.css";

export default function AppLayout({ setIsLoggedIn }){

     const navigate = useNavigate();

        const handleLogout = async () => {
            try {

                await fetch("/api/login/logout", {
                    method: "POST",
                    credentials: "include",
                });

                setIsLoggedIn(false);

                navigate("/login");

            } catch (error) {
                console.error("로그아웃 실패", error);
            }
        };

    return (
        <div className = "app-layout">
{/*  사이드바  */}
            <aside className="sidebar">

                <div>

                    <h2 className="sidebar-title">
                        Tracker
                    </h2>

                    <nav className="sidebar-menu">

                        <NavLink to="/dashboard">
                            대시보드
                        </NavLink>

                        <NavLink to="/tasks" end>
                            작업목록
                        </NavLink>

                        <NavLink to="/tasks/new">
                            작업등록
                        </NavLink>

                    </nav>

                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    로그아웃
                </button>

            </aside>
                 {/* 메인 콘텐츠 */}
                 <main className="main-content">
                    <Outlet />
                 </main>

                </div>




            );
        }