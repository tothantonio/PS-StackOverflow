import { useEffect, useState } from "react";
import {
    fetchUserById,
    getCurrentUser,
    setCurrentUser,
    updateProfile,
} from "../../services/userService.ts";

function ProfileContactForm() {
    const user = getCurrentUser();
    const [email, setEmail] = useState(user.email ?? "");
    const [phone, setPhone] = useState(user.phone ?? "");
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        if (!user?.id) return;

        async function loadProfile() {
            try {
                const fresh = await fetchUserById(user.id);
                setEmail(fresh.email ?? "");
                setPhone(fresh.phone ?? "");
                setCurrentUser({
                    ...user,
                    email: fresh.email,
                    phone: fresh.phone,
                });
            } catch (error) {
                console.error(error);
            }
        }

        void loadProfile();
    }, [user]);

    async function handleSave() {
        setSaving(true);
        setMessage("");
        try {
            const updated = await updateProfile(user.id, {
                email: email.trim(),
                phone: phone.trim(),
            });
            setCurrentUser({
                ...user,
                email: updated.email,
                phone: updated.phone,
            });
            setMessage("Contact details saved.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to save profile.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="profile-panel">
            <h2>Contact details</h2>
            <p className="empty-state">
                Email and phone are used for ban notifications (required by the assignment).
            </p>

            <label className="profile-field">
                <span>Email</span>
                <input
                    className="question-form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                />
            </label>

            <label className="profile-field">
                <span>Phone (international format)</span>
                <input
                    className="question-form-input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+40700111222"
                />
            </label>

            <button
                type="button"
                className="ask-button"
                onClick={() => void handleSave()}
                disabled={saving}
            >
                {saving ? "Saving..." : "Save contact details"}
            </button>

            {message && <p className="form-message">{message}</p>}
        </section>
    );
}

export default ProfileContactForm;
