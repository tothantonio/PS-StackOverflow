import QuestionCard from "./QuestionCard.tsx";
import type {Question} from "../types/questionTypes.ts";



type QuestionListProps = { //ce primeste componneta props
    questions :Question[];
}
function QuestionsList({questions} : QuestionListProps){
    return (
        <>
            {questions.map((q) => (
                 <QuestionCard
                    key={q.id}
                    title={q.title}
                    body={q.body}
                    author={q.author}
                    tags={q.tags}
                />
            ))}
        </>
    )
}
export default QuestionsList;