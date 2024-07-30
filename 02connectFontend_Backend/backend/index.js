// const express = require('express')
import express from 'express';
const app = express()
const port = process.env.port || 3000

let cars = [
    {
      "color": "purple",
      "type": "minivan",
      "registration": new Date('2017-01-03'),
      "capacity": 7
    },
    {
      "color": "red",
      "type": "station wagon",
      "registration": new Date('2018-03-03'),
      "capacity": 5
    },
    {
      "color": "white",
      "type": "suv",
      "registration": new Date('2019-03-04'),
      "capacity": 6
    }
]

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })
app.get('/api/cars', (req, res) => {
    res.send(cars);
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})