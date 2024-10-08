import Footer from "./components/Footer"
import Body from "./components/Body"
import Header from "./components/Header"
import Main from "./components/main"
import { Analytics } from '@vercel/analytics/react';

function App() {

  return (
    
    <>
    
      <Header/>
      <div className="bg-blue-200 max-h-full max-w-full 2xl:w-screen 2xl:max-h-max	md:w-screen">
        <Body>
        </Body>
        <Footer/>
        <Main/>
        <Analytics />
      </div>
    </>
  )
}

export default App
