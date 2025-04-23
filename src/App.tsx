import { Link } from 'react-router-dom';





function App() {


  return (
    
    < >

        
       

   
 
    <div className="p-10 m-20  max-w-sm mx-auto color5 rounded-xl shadow-md space-y-4 ">
      <h1 className="text-2xl font-bold">Welcome, Trackers!</h1>
      <p className="text-black-900">Here's your personal app to track and save your perfect fit in a job.</p>
     
    
    <Link to={'/Login'}> 
    <button className="w-md px-4 py-2 font-bold text-white color2 rounded-md hover:bg-buttonsHover focus:outline-none focus:ring-2 focus:color1"  > Log In  </button>
     </Link>
    
     </div>
 
    
    </>
    
  )
}

export default App
