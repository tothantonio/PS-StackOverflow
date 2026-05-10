import type {ReactNode} from "react";

type MainLayoutProps ={
    children:ReactNode;
}

function MainLayout({children}:MainLayoutProps){
    return (
        <>
            <header style={{padding:"10px",background:"#eee"}}>
                <h2>My App</h2>
            </header>

            <main style={{padding:"20px"}}>
                {children}
            </main>
        </>
    )
}

export default MainLayout;