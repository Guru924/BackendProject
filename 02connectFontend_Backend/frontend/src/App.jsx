import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [cars, setCars] = useState([])

  useEffect(() => {
    ; (async () => {
      const carResponse = await fetch("/api/cars")
      const data = await carResponse.json()
      setCars(data)
      // fetch("/api/cars")
      // .then((response)=>{
      //   return response.json()
      // }).then((data)=>{
      //   // console.log(data)
      //   setCars(data)
      // })
    })()
  }, [setCars])

  return (
    <>
      <h1>frontend</h1>
      <p>Cars: {cars.length}</p>
      {
        cars.map((car, index) => (
          <div key={index}>
            <h1>{car.type}</h1>
            <div>{car.color}</div>
            <div>{car.registration}</div>
            <div>{car.capacity}</div>
          </div>
        ))
      }
    </>
  )
}

export default App
