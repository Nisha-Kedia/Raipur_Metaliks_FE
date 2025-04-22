import React, { useEffect, useState } from 'react'
import "./Home.css"
import data from "./data.json"
import { useRef } from 'react'

function Home() {
  console.log(data[0].download_url);

  const [next,setNext] =useState(0)
   
  let ref = useRef(null);

  const handleNext =() =>{
    // if(next==data.length-1)
    // {
    //   setNext(0)
    // }else{
    // setNext(next+1)
    // }
    setNext((previousValue)=>{
      if(previousValue==data.length-1)
      {
        return 0
      }
      return previousValue+1
    })
  }

  const handlePrev=() =>{
    if(next ==0)
    {
      setNext(data.length-1)
    }
    else{
      setNext(next-1)
    }
  }

  useEffect(()=>{
    ref.current=setInterval(handleNext,1000);
    return(()=>{
      clearInterval(ref.current)
    })
  },[])

  return (
    <div className="slider" id="home" onMouseEnter={()=>clearInterval(ref.current)} onMouseLeave={()=>ref.current=setInterval(handleNext,1000)}>
      <div className="left-btn">
        <button onClick={handlePrev}>{"<"}</button>
      </div> 
        <img src= {data[next].download_url} alt="img" />
        {/* <img src= {img2} alt="img" />
        <img src= {img3} alt="img" /> */}
        <div className="right-btn">
        <button onClick={handleNext}>{">"}</button>
      </div>
    </div>
  )
}

export default Home
