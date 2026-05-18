import { useEffect, useState } from "react";
import {
    banUser,
    fetchAllUsers,
    getCurrentUser,
    type ApiUser,
    unbanUser,
} from "../../services/userService.ts";

function ModeratorPanel() {
    const moderator = getCurrentUser();
    const [users, setUsers] = useState<ApiUser[]>([]);
    const [reasonByUser, setReasonByUser] = useState<Record<number, string>>({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    async function loadUsers() {
        setLoading(true);
        try {
            const data = await fetchAllUsers();
            setUsers(data.filter((user) => user.id !== moderator.id));
            setMessage("");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to load users.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const moderatorId = moderator.id;

        async function load() {
            setLoading(true);
            try {
                const data = await fetchAllUsers();
                setUsers(data.filter((user) => user.id !== moderatorId));
                setMessage("");
            } catch (error) {
                setMessage(error instanceof Error ? error.message : "Failed to load users.");
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [moderator.id]);

    async function handleBan(userId: number) {
        const reason = reasonByUser[userId]?.trim() || "Violation of community guidelines";
        try {
            await banUser(userId, moderator.id, reason);
            setMessage("User banned. Email and SMS notifications were sent.");
            await loadUsers();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to ban user.");
        }
    }

    async function handleUnban(userId: number) {
        try {
            await unbanUser(userId, moderator.id);
            setMessage("User unbanned.");
            await loadUsers();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to unban user.");
        }
    }

    return (
        <section className="profile-panel moderator-panel">
            <h2>Moderator tools</h2>
            <p className="empty-state">
                Ban or unban users. Banned users cannot log in or use the app.
            </p>

            {message && <p className="form-message">{message}</p>}

            {loading ? (
                <p className="empty-state">Loading users...</p>
            ) : users.length === 0 ? (
                <p className="empty-state">No users to moderate.</p>
            ) : (
                <div className="moderator-user-list">
                    {users.map((user) => (
                        <article key={user.id} className="moderator-user-card">
                            <div className="moderator-user-header">
                                <strong>{user.username}</strong>
                                <span>{user.email}</span>
                                <span
                                    className={`status-badge ${
                                        user.isBanned ? "status-solved" : "status-received"
                                    }`}
                                >
                                    {user.isBanned ? "Banned" : user.role ?? "USER"}
                                </span>
                            </div>
                            {!user.isBanned ? (
                                <>
                                    <input
                                        className="question-form-input"
                                        placeholder="Ban reason"
                                        value={reasonByUser[user.id] ?? ""}
                                        onChange={(e) =>
                                            setReasonByUser((prev) => ({
                                                ...prev,
                                                [user.id]: e.target.value,
                                            }))
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="danger-button"
                                        onClick={() => void handleBan(user.id)}
                                    >
                                        Ban user
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    className="ask-button"
                                    onClick={() => void handleUnban(user.id)}
                                >
                                    Unban user
                                </button>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default ModeratorPanel;
