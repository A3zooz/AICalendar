import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import {parseAvailability} from './parsePrompt.js'
import Tutor from './schema.js'
import cors from 'cors'

dotenv.config()
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log(err)
    })

app.get('/api/get-tutor', async (req,res) => {
    try{
        const tutor = await Tutor.findOne({
            email: req.query.email
        })
        res.status(200).json(tutor)

    } catch (error){
        console.log(error)
        res.status(404).json(error)
    }
    
})

app.post('/api/new-tutor', async (req, res) => {
    const {email,subjects, availability} = req.body
    console.log(req.body)

    const existingTutor = await Tutor.findOne({email})
    if(existingTutor){
        //update existing tutor
        try{
            existingTutor.subjects = subjects
            existingTutor.slots = []
            for (const [day, slots] of Object.entries(availability)){
                for (const slot of slots){
                    existingTutor.slots.push({
                        day,
                        startTime: slot[0],
                        endTime: slot[1]
                    })
                }
            }
            await existingTutor.save()
            res.status(200).json(existingTutor)
        } catch (error){
            console.log(error)
            res.status(404).json(error)
        }
    }

    else{
    const tutor = new Tutor({
        email,
        subjects,
        slots: []
    })
    try{
        //loop on key value pairs
        for (const [day, slots] of Object.entries(availability)){
            for (const slot of slots){
                tutor.slots.push({
                    day,
                    startTime: slot[0],
                    endTime: slot[1]
                })
            }
        }        
        await tutor.save()
        res.status(200).json(tutor)
    }
    catch (error){
        console.log(error)
        res.status(404).json(error)
    }
}
}
)

app.post('/api/parse-availability', async (req, res) => {
    const {email,subjects,availability} = req.body
    try{
        const parsedAvailability = await parseAvailability(availability)
        res.status(200).json({
            email: email,
            subjects: subjects,
            availability: parsedAvailability
        })
    } catch (error){
        console.log(error)
        res.status(404).json(error)
    }

    })



app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})


    

