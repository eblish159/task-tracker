import {NavLink, Outlet} from "react-router-dom";
import "./AppLayout.css";

export default function AppLayout(){
    return (
        <div className = "app-layout">
{/*  사이드바  */}
            <aside className="sidebar">

                <h2 className="sidebar-title">
                    Tracker
                </h2>

                <nav className= "sidebar-menu">

                    <NavLink to ="/dashboard">
                      대시보드
                    </NavLink>

                    <NavLink to ="/tasks">
                      작업목록
                    </NavLink>

                     <NavLink to ="/tasks/new">
                      작업등록
                     </NavLink>
                </nav>
                      </aside>

                 {/* 메인 콘텐츠 */}
                 <main className="main-content">
                    <Outlet />
                 </main>

                </div>




            );
        }