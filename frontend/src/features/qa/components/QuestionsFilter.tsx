import React, { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { getTags } from "../../../services/tagService.ts";
import { fetchAllUsers } from "../../../services/userService.ts";

interface Tag {
    id: number;
    name: string;
}

interface UserOption {
    id: number;
    username: string;
}

interface QuestionsFilterProps {
    onSearch?: (keyword: string) => void;
    onFilterByTag?: (tagNames: string[]) => void;
    onFilterByUser?: (userId: number | undefined) => void;
    onShowMyQuestions?: (show: boolean) => void;
    onClearFilters?: () => void;
}

export const QuestionsFilter: React.FC<QuestionsFilterProps> = ({
    onSearch,
    onFilterByTag,
    onFilterByUser,
    onShowMyQuestions,
    onClearFilters,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [availableUsers, setAvailableUsers] = useState<UserOption[]>([]);
    const [userSearch, setUserSearch] = useState("");
    const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
    const [showFilters, setShowFilters] = useState(false);
    const [showMyQuestions, setShowMyQuestions] = useState(false);

    useEffect(() => {
        async function loadFilterOptions() {
            try {
                const tags = await getTags();
                setAvailableTags(tags);
            } catch (error) {
                console.error("Failed to fetch tags:", error);
            }

            try {
                const users = await fetchAllUsers();
                setAvailableUsers(
                    users.map((user) => ({
                        id: user.id,
                        username: user.username,
                    }))
                );
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        }

        void loadFilterOptions();
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearch?.(query);
    };

    const handleTagToggle = (tagName: string) => {
        const newTags = selectedTags.includes(tagName)
            ? selectedTags.filter((t) => t !== tagName)
            : [...selectedTags, tagName];

        setSelectedTags(newTags);
        onFilterByTag?.(newTags);
    };

    const handleMyQuestionsToggle = () => {
        const newShowMyQuestions = !showMyQuestions;
        setShowMyQuestions(newShowMyQuestions);
        onShowMyQuestions?.(newShowMyQuestions);
    };

    const handleUserSelect = (user: UserOption) => {
        setSelectedUserId(user.id);
        setUserSearch(user.username);
        onFilterByUser?.(user.id);
    };

    const handleClearUserFilter = () => {
        setSelectedUserId(undefined);
        setUserSearch("");
        onFilterByUser?.(undefined);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setSelectedTags([]);
        setShowMyQuestions(false);
        setSelectedUserId(undefined);
        setUserSearch("");
        onFilterByUser?.(undefined);
        onSearch?.("");
        onFilterByTag?.([]);
        onShowMyQuestions?.(false);
        onClearFilters?.();
    };

    const normalizedUserSearch = userSearch.trim().toLowerCase();
    const matchingUsers = availableUsers.filter((user) =>
        user.username.toLowerCase().includes(normalizedUserSearch)
    );

    const activeFilterCount =
        (searchQuery ? 1 : 0) +
        selectedTags.length +
        (showMyQuestions ? 1 : 0) +
        (selectedUserId != null ? 1 : 0);

    const hasActiveFilters = activeFilterCount > 0;

    return (
        <div className="questions-filter">
            <div className="search-container">
                <Search size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery("");
                            onSearch?.("");
                        }}
                        className="clear-search"
                        type="button"
                        aria-label="Clear search"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            <button
                onClick={() => setShowFilters(!showFilters)}
                className="filter-toggle-btn"
                type="button"
            >
                <Filter size={18} />
                Filter
                {hasActiveFilters && (
                    <span className="filter-badge">{activeFilterCount}</span>
                )}
            </button>

            {showFilters && (
                <div className="filter-panel">
                    <div className="filter-section">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={showMyQuestions}
                                onChange={handleMyQuestionsToggle}
                            />
                            <span>Show only my questions</span>
                        </label>
                    </div>

                    <div className="filter-section">
                        <h3 className="filter-title">Filter by user</h3>
                        <input
                            className="question-form-input"
                            type="text"
                            value={userSearch}
                            onChange={(e) => {
                                const value = e.target.value;
                                setUserSearch(value);
                                if (!value.trim()) {
                                    handleClearUserFilter();
                                }
                            }}
                            placeholder="Type a username..."
                        />
                        {userSearch.trim() && matchingUsers.length > 0 && (
                            <div className="user-filter-suggestions">
                                {matchingUsers.slice(0, 8).map((user) => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        className={
                                            selectedUserId === user.id
                                                ? "user-filter-btn selected"
                                                : "user-filter-btn"
                                        }
                                        onClick={() => handleUserSelect(user)}
                                    >
                                        {user.username}
                                    </button>
                                ))}
                            </div>
                        )}
                        {selectedUserId != null && (
                            <button
                                type="button"
                                className="clear-user-filter-btn"
                                onClick={handleClearUserFilter}
                            >
                                Clear user filter
                            </button>
                        )}
                    </div>

                    <div className="filter-section">
                        <h3 className="filter-title">Filter by Tags</h3>
                        <div className="tags-list">
                            {availableTags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.name)}
                                    className={`tag-filter-btn ${
                                        selectedTags.includes(tag.name) ? "selected" : ""
                                    }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedTags.length > 0 && (
                        <div className="selected-tags">
                            <p className="selected-tags-label">Selected tags:</p>
                            <div className="tags-display">
                                {selectedTags.map((tag) => (
                                    <div key={tag} className="tag-badge">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleTagToggle(tag)}
                                            className="remove-tag"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="clear-filters-btn"
                            type="button"
                        >
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
