import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({
    NumOfPatient: {
        type: Number,
        required: true,
    },
    NumOfDoctor: {
        type: Number,
        required: true
    }
},{timestamps: true})

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema)