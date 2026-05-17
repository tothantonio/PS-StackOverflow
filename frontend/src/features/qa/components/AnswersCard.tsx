import type {AnswerDto} from "../types/answerTypes.ts";
import { useState, type ChangeEvent } from "react";
import Markdown from "./Markdown.tsx";
import VoteColumn from "./VoteColumn.tsx";
import PostPicture from "./PostPicture.tsx";
import { fileToCompressedDataUrl } from "../../../services/imageUtils.ts";

type AnswersCardProps = {
    answer: AnswerDto;
    canEdit: boolean;// daca userul poate edita sau sterge
    canAccept: boolean;
    canVote: boolean;
    isSolved: boolean;
    onVote: (answerId: number, direction: 1 | -1) => void; // functie pentru vot
    onDelete: (answerId: number) => void;// functie pentru delete
    onAccept: (answerId: number) => void;
    onEdit: (answerId: number, body: string, picture?: string | null) => void;
};

function formatAnswerDate(value: string) {// tr data din string intr o data reala
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function getInitials(username: string) {
    return username
        .split(/\s+/)//imparte textu dupa spatii
        .filter(Boolean)//elimina elem goale
        .map((part) => part[0])//ia prima litera din fiecare cuv
        .join("")//uneste literele intr un sg sting: ["A", "P"]->"AP"
        .slice(0, 2)//pastr doar primele 2 litere
        .toUpperCase();
}

function AnswersCard({answer, canEdit, canAccept, canVote, isSolved, onVote, onDelete, onAccept, onEdit}: AnswersCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editError, setEditError] = useState("");
    const [body, setBody] = useState(answer.body);
    const displayPicture = answer.picture ?? "";
    const [picture, setPicture] = useState(displayPicture);

    async function handlePictureFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setPicture(await fileToCompressedDataUrl(file));
        } catch {
            setPicture("");
        }
    }

    return (
        <article className={`answer-card ${answer.accepted ? "accepted" : ""}`}>
            <VoteColumn
                votes={answer.voteCount}
                accepted={answer.accepted}
                disabled={!canVote}
                onUpvote={() => onVote(answer.id, 1)}
                onDownvote={() => onVote(answer.id, -1)}
            />

            <div className="detail-content answer-content">
                <div className="answer-topline">
                    {answer.accepted && <span className="accepted-label">Accepted answer</span>}
                    <span className="answer-date">{formatAnswerDate(answer.createdAt)}</span>
                </div>

                {isEditing ? (
                    <div className="answer-edit-form">
                        <textarea value={body} onChange={(event) => setBody(event.target.value)} />
                        <label className="picture-upload">
                            <span>Picture</span>
                            <input type="file" accept="image/*" onChange={handlePictureFileChange} />
                        </label>
                        {picture && (
                            <div className="picture-upload-preview">
                                <PostPicture src={picture} alt="Answer preview" />
                                <button className="tag-create-button" type="button" onClick={() => setPicture("")}>
                                    Remove picture
                                </button>
                            </div>
                        )}
                        {editError && <span className="answer-error">{editError}</span>}
                        <button className="ask-button" onClick={() => {
                            if (!body.trim()) {
                                setEditError("Answer text is required.");
                                return;
                            }
                            setEditError("");
                            onEdit(answer.id, body, picture.trim() || undefined);
                            setIsEditing(false);
                        }}>
                            Save answer
                        </button>
                    </div>
                ) : (
                    <>
                        <Markdown source={answer.body} />
                        {displayPicture && (
                            <PostPicture src={displayPicture} alt="Answer attachment" />
                        )}
                    </>
                )}

                <div className="answer-actions">
                    {canEdit && <button className="back-link" onClick={() => setIsEditing((value) => !value)}>Edit</button>}
                    {canEdit && <button className="danger-button" onClick={() => onDelete(answer.id)}>Delete</button>}
                    {canAccept && !isSolved && (
                        <button className="back-link" onClick={() => onAccept(answer.id)}>
                            Accept answer
                        </button>
                    )}
                </div>
                <footer className="answer-author">
                    <div className="answer-author-card">
                        <span className="answer-avatar">
                            <span className="avatar-text">{getInitials(answer.author.username)}</span>
                        </span>
                        <div>
                            <strong>{answer.author.username}</strong>
                            <span>answered {formatAnswerDate(answer.createdAt)}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </article>
    );
}

export default AnswersCard;


