import { Link } from "react-router-dom";
import type {UserDto} from "../types/userTypes.ts";
//link catre intrebare cand apesi pe ea
type QuestionCardProps = {
    id:number,
    title: string;
    body: string;
    author: UserDto;
    tags: string[];
};

function QuestionCard({id,title,body,author,tags}:QuestionCardProps){
    return (
        <div style ={{border:"1px solid #ccc",padding:"10px",marginBottom:"10px"}}>
            <h2>
                <Link to={`/questions/${id}`} style={{textDecoration :'none',color:'hotpink'}} >
                        {title}
                </Link>
            </h2>
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