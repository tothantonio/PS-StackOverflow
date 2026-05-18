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
            return response.json() as Promise<{
                voteCount: number;
                authorScore: number;
                voterScore?: number | null;
            }>;
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
            return response.json() as Promise<{
                voteCount: number;
                authorScore: number;
                voterScore?: number | null;
            }>;
        },
    },

    // Tags endpoints
    tags: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/tags`);
            if (!response.ok) throw new Error("Failed to fetch tags");
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
    },
};
