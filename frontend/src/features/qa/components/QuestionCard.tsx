import type {User} from "../types/userTypes.ts";

type QuestionCardProps = {
    title: string;
    body: string;
    author: User;
    tags: string[];
};

function QuestionCard({title,body,author,tags}:QuestionCardProps){
    return (
        <div style ={{border:"1px solid #ccc",padding:"10px",marginBottom:"10px"}}>
            <h2>{title}</h2>
            <p>{body}</p>
            <small>Author : {author.username}</small>

            <div>
                {tags.map((tag) => (
                    <span key={tag} style={{marginRight:"5px"}}>
                        #{tag}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default QuestionCard;