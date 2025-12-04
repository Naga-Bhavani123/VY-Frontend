import Navbar from "../NavBar/index.jsx"
import {useState, useEffect} from "react"
import Components from "../ComponentsDashboard/index.jsx"
import "./index.css"


const BASE_URL = "https://vy-backend.onrender.com"


const Home = () => {

    const [attendanceOptions, setAttendance] = useState(""); 
    const jwtToken = localStorage.getItem("jwt_token")

    async function attendance() {
               const options = {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`
            },
            body: JSON.stringify({mode: attendanceOptions})
          }

          const response = await fetch(`${BASE_URL}/employee/attendance/mark-today`, options); 
          
          const responsedData = await response.json(); 

          if (response.ok){
                     
            if (attendanceOptions === "CHECK_IN") {
                setAttendance("CHECK_OUT"); 
          }else if (attendanceOptions === "CHECK_OUT"){
                setAttendance("DONE"); 
            }
          }else{
            if(responsedData.isApproved){
                setAttendance("DONE"); 
          } else{
                
                setAttendance("CHECK_OUT"); 
               
            }
          }
        }
      
    
 const onCheckin =async () => {
           attendance()
    }

    const onCheckout = async () => {
           attendance()
    }



    useEffect(() => {
        
      
    async function attendance() {
               const options = {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`
            },
        }

          const response = await fetch(`${BASE_URL}/employee/attendance/status`, options); 
          
          const responsedData = await response.json(); 

          if (response.ok){
              setAttendance(responsedData.nextAction)
          }
        }

        attendance()
      
    }, [])
    
   
   
    const gettingCheckings = () => {
          switch (true){
            case attendanceOptions === "":
                return  <div className="vy-dots-loader">
                            <div className="vy-dot"></div>
                            <div className="vy-dot"></div>
                            <div className="vy-dot"></div>
                        </div>
            case attendanceOptions === "CHECK_IN":
                 return <button className="check_in attendanceButton" onClick = {onCheckin}>Check in</button>; 
               
            case attendanceOptions === "CHECK_OUT":
                return <button className="check_out attendanceButton" onClick = {onCheckout}>Check out</button>; 
            default:
               return  <button className="done attendanceButton">Done</button>


          }
    }

    return (
        <>
       <Navbar/>
       <div className="homeCon">
           <div className = "attendanceButtom">
              {gettingCheckings()}
           </div>
           <Components/>
       </div>
       </>
    )
}

export default Home;