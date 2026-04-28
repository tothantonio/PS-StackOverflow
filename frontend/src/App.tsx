import {useEffect, useState} from 'react'
import './App.css'

function App(){
  //question variabla cu date(lista de intrebari) si setQuestion fucntia care modifica var de date
  const[questions,setQuestions] =useState([]); //usestate init state

  //useEffect e un triger crae ruleaza cod cand se intampla ceva
  useEffect(() => {
    fetch('http://localhost:8080/api/questions')
        .then(res => res.json()).then(data => setQuestions(data));
  },[]);  //[] array gol inseamna ca ruleaza o singura data la inceput, daca se scoate e loop infinit
 return ( //return UI
     <div>
       <h1>Questions</h1>

       {questions.map((q:any) => ( //pt fiecare el din lsta face UI
           //fiecare div are un id ajuta ca react sa faca update corect
           <div key={q.id}>
             <h2>{q.title}</h2>
             <p>{q.content}</p>
             <p>React merge</p>
           </div>
       ))}
      </div>
 ) ;
}
export default App;