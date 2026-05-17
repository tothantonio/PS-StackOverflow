const API_BASE_URL = "http://localhost:8080/api";

export const apiClient = {
    // Questions endpoints
    questions: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/questions`);
            if (!response.ok) throw new Error("Failed to fetch questions");
            return response.json();
        },
        getById: async (id: number) => {
            const response = await fetch(`${API_BASE_URL}/questions/${id}`);
            if (!response.ok) throw new Error("Failed to fetch question");
            return response.json();
        },
        getByAuthor: async (authorId: number) => {
            const response = await fetch(`${API_BASE_URL}/questions/author/${authorId}`);
            if (!response.ok) throw new Error("Failed to fetch author questions");
            return response.json();
        },
        search: async (keyword?: string) => {
            const params = keyword ? `?keyword=${encodeURIComponent(keyword)}` : "";
            const response = await fetch(`${API_BASE_URL}/questions/search${params}`);
            if (!response.ok) throw new Error("Failed to search questions");
            return response.json();
        },
        filterByTag: async (tagName: string) => {
            const response = await fetch(`${API_BASE_URL}/questions/filter/tag?tagName=${encodeURIComponent(tagName)}`);
            if (!response.ok) throw new Error("Failed to filter by tag");
            return response.json();
        },
        filterByTags: async (tagNames: string[]) => {
            const params = tagNames.map(tag => `tagNames=${encodeURIComponent(tag)}`).join("&");
            const response = await fetch(`${API_BASE_URL}/questions/filter/tags?${params}`);
            if (!response.ok) throw new Error("Failed to filter by tags");
            return response.json();
        },
        create: async (data: { title: string; body: string; imageUrl?: string; tags?: string[] }, authorId: number) => {
            const tagNames = (data.tags || []).join(",");
            const response = await fetch(`${API_BASE_URL}/questions?authorId=${authorId}&tagNames=${encodeURIComponent(tagNames)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: data.title,
                    body: data.body,
                    imageUrl: data.imageUrl || null,
                }),
            });
            if (!response.ok) throw new Error("Failed to create question");
            return response.json();
        },
        update: async (id: number, data: { title: string; body: string; imageUrl?: string; tags?: string[] }, authorId: number) => {
            const tagNames = (data.tags || []).join(",");
            const response = await fetch(`${API_BASE_URL}/questions/${id}?authorId=${authorId}&tagNames=${encodeURIComponent(tagNames)}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: data.title,
                    body: data.body,
                    imageUrl: data.imageUrl || null,
                }),
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to update question");
            }
            return response.json();
        },
        delete: async (id: number, authorId: number) => {
            const response = await fetch(`${API_BASE_URL}/questions/${id}?authorId=${authorId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to delete question");
            }
        },
    },

    // Answers endpoints
    answers: {
        getByQuestion: async (questionId: number) => {
            const response = await fetch(`${API_BASE_URL}/answers?questionId=${questionId}`);
            if (!response.ok) throw new Error("Failed to fetch answers");
            return response.json();
        },
        create: async (data: { body: string; imageUrl?: string; questionId: number }, authorId: number) => {
            const response = await fetch(`${API_BASE_URL}/answers?questionId=${data.questionId}&authorId=${authorId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    body: data.body,
                    imageUrl: data.imageUrl || null,
                    question: { id: data.questionId },
                }),
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to create answer");
            }
            return response.json();
        },
        update: async (id: number, data: { body: string; imageUrl?: string }, authorId: number, questionId: number) => {
            const response = await fetch(`${API_BASE_URL}/answers/${id}?authorId=${authorId}&questionId=${questionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    body: data.body,
                    imageUrl: data.imageUrl || null,
                }),
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to update answer");
            }
            return response.json();
        },
        accept: async (id: number, authorId: number, questionId: number) => {
            const response = await fetch(
                `${API_BASE_URL}/answers/${id}/accept?authorId=${authorId}&questionId=${questionId}`,
                { method: "POST" }
            );
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to accept answer");
            }
            return response.json();
        },
        delete: async (id: number, authorId: number) => {
            const response = await fetch(`${API_BASE_URL}/answers/${id}?authorId=${authorId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to delete answer");
            }
        },
    },

    votes: {
        voteQuestion: async (questionId: number, userId: number, direction: 1 | -1) => {
            const response = await fetch(
                `${API_BASE_URL}/votes/questions/${questionId}?userId=${userId}&direction=${direction}`,
                { method: "POST" }
            );
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to vote on question");
            }
            return response.json() as Promise<{ voteCount: number }>;
        },
        voteAnswer: async (answerId: number, userId: number, direction: 1 | -1) => {
            const response = await fetch(
                `${API_BASE_URL}/votes/answers/${answerId}?userId=${userId}&direction=${direction}`,
                { method: "POST" }
            );
            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to vote on answer");
            }
            return response.json() as Promise<{ voteCount: number }>;
        },
    },

    // Tags endpoints
    tags: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/tags`);
            if (!response.ok) throw new Error("Failed to fetch tags");
            return response.json();
        },
        getById: async (id: number) => {
            const response = await fetch(`${API_BASE_URL}/tags/${id}`);
            if (!response.ok) throw new Error("Failed to fetch tag");
            return response.json();
        },
        getByName: async (name: string) => {
            const response = await fetch(`${API_BASE_URL}/tags/name/${encodeURIComponent(name)}`);
            if (!response.ok) throw new Error("Failed to fetch tag");
            return response.json();
        },
        create: async (name: string) => {
            const response = await fetch(`${API_BASE_URL}/tags`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) throw new Error("Failed to create tag");
            return response.json();
        },
        update: async (id: number, name: string) => {
            const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            if (!response.ok) throw new Error("Failed to update tag");
            return response.json();
        },
        delete: async (id: number) => {
            const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete tag");
        },
    },

    // Users endpoints
    users: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/users`);
            if (!response.ok) throw new Error("Failed to fetch users");
            return response.json();
        },
        getById: async (id: number) => {
            const response = await fetch(`${API_BASE_URL}/users/${id}`);
            if (!response.ok) throw new Error("Failed to fetch user");
            return response.json();
        },
    },

    // Auth endpoints
    auth: {
        login: async (username: string, password: string) => {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) throw new Error("Login failed");
            return response.json();
        },
        register: async (username: string, email: string, password: string) => {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            if (!response.ok) throw new Error("Registration failed");
            return response.json();
        },
    },
};
