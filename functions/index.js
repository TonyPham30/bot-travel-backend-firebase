const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json")
const { responseSuccess, responseErrorFromServer, responseErrorFromClient, responseDataSuccess } = require("./src/configs/constant");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fir-training-c0b22-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv");
const app = express()
app.use(cors())
const database = admin.firestore()
// create booking flight
app.post("/booking-flight", async (req, res) => {
    try {
        await database.collection("booking-travel").doc(`/${Date.now()}/`).create({
            id: Date.now(),
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            boarding: req.body.boarding,
            destination: req.body.destination
        })
        return responseSuccess(res, "create booking flight success")
    } catch (error) {
        return responseErrorFromServer(res, "create booking flight false")
    }
})


// find user with phone number then update booking cab
app.put("/booking-cab/:id", async (req, res) => {
    try {
        const reqDoc = await database.collection("booking-travel").doc(req.params.id)
        if (!reqDoc) {
            responseErrorFromClient(res, "user")
        }
        await reqDoc.update({
            location: req.body.location,
            name: req.body.nameForCar,
            typeCar: req.body.typeCar
        })
        const bookingDetail = await reqDoc.get()
        const responseBookingCab = bookingDetail.data()
        return responseDataSuccess(res,responseBookingCab, "update add cab success")
    } catch (error) {
        console.log("error", error)
        return responseErrorFromServer(res, "update cab false")
    }
})

// find user with number phone
app.get("/user/:id", async (req, res) => {
    try {
        const reqDoc = await database.collection("booking-travel").doc(req.params.id)
        if (!reqDoc) {
            responseErrorFromClient(res, "user")
        }
        const userDetail = await reqDoc.get()
        const responseUser = userDetail.data()
        return responseDataSuccess(res, responseUser, "find success user")
    } catch (error) {
        console.log(error)
        return responseErrorFromServer(res, "find user false")
    }
})

// update date
app.put("/update-date/:id", async (req, res) => {
    try {
        const reqDoc = await database.collection("booking-travel").doc(req.params.id)
        if(!reqDoc) {
            responseErrorFromClient(res, "date")
        }
        await reqDoc.update({
            destination: req.body.destination
        })
        const bookingDetail = await reqDoc.get()
        const responseBooking = bookingDetail.data()
        return responseDataSuccess(res, responseBooking, "update destination success")
    } catch (error) {
        return responseErrorFromServer(res, "update destination false")
    }
})
// update location
app.put("/update-location/:id", async(req, res) => {
    try {
        const reqDoc = await database.collection("booking-travel").doc(req.params.id)
        if(!reqDoc) {
            responseErrorFromClient(res, "location")
        }
        await reqDoc.update({
            location: req.body.location
        })
        const bookingDetail = await reqDoc.get()
        const responseBooking = bookingDetail.data()
        return responseDataSuccess(res, responseBooking, "update location success")
    } catch (error) {
        return responseErrorFromServer(res, "update location false")
    }
})

// delete booking 
app.delete("/delete-booking/:id", async (req, res) => {
    try {
        const reqDoc = await database.collection("booking-travel").doc(req.params.id)
        if(!reqDoc) {
            return responseErrorFromClient(res, "booking")
        }
        await reqDoc.delete()
        return responseSuccess(res, "delete booking success")
    } catch (error) {
        console.log(error)
        return responseErrorFromServer(res, "can't not delete booking")
    }
})
exports.app = functions.https.onRequest(app)