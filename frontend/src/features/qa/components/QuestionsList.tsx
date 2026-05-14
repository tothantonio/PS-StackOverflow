import QuestionCard from "./QuestionCard.tsx";
import type {QuestionDto} from "../types/questionTypes.ts";



type QuestionListProps = { //ce primeste componneta props
    questions :QuestionDto[];
}
function QuestionsList({questions} : QuestionListProps){
    return (
        <>
            {questions.map((q) => (
                 <QuestionCard
                    key={q.id}
                    id={q.id}
                    title={q.title}
                    body={q.body}
                    author={q.author}
                    tags={q.tags}
                    createdAt={q.createdAt}
                />
            ))}
        </>
    )
}
export default QuestionsList;

