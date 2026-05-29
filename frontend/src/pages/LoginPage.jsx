import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage({ setIsLoggedIn }) {

    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setErrorMessage("");

        try {

            const response = await fetch("/api/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                credentials: "include",

                body: JSON.stringify({
                    userId,
                    userPassword,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(
                    data.error || "로그인 실패"
                );
                return;
            }

            // 로그인 상태 변경
            setIsLoggedIn(true);

            // 대시보드 이동
            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            setErrorMessage(
                "서버와 연결할 수 없습니다."
            );
        }
    };

    return (
        <div className="login-page">

            <div className="login-panel">

                <div className="login-logo">
                    Tracker
                </div>

                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >

                    <input
                        type="text"
                        placeholder="아이디"
                        value={userId}
                        onChange={(e) =>
                            setUserId(e.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={userPassword}
                        onChange={(e) =>
                            setUserPassword(e.target.value)
                        }
                    />

                    {errorMessage && (
                        <div className="login-error">
                            {errorMessage}
                        </div>
                    )}

                    <button type="submit">
                        로그인
                    </button>

                </form>
            </div>
        </div>
    );
}

export default LoginPage;