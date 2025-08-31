/*
 * Module dependencies
 */
const express = require('express')
const cors = require('cors')
const queryAllProperties = require('./queryAllProperties');
const queryPropertyById = require('./queryPropertyById');
const queryPropertiesByCity = require('./queryPropertiesByCity');
const addProperty = require('./addProperty');
const updateProperty = require('./updateProperty');
const bodyParser = require('body-parser')


const app = express()

// To control CORSS-ORIGIN-RESOURCE-SHARING( CORS )
app.use(cors())
app.options('*', cors()); 

// To parse encoded data
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 



// Get all properties
app.get('/get-properties', function (req, res) {
    queryAllProperties.main()
    .then(result => {
        const parsedData = JSON.parse(result);
        res.send(parsedData);
    })
    .catch(err => {
        console.error({ err })
        res.status(500).send('FAILED TO GET DATA!')
    })
})

// Get property by ID
app.get('/get-property', function (req, res) {
    if (!req.query.propertyId) {
        res.status(400).send('propertyId is required');
        return;
    }
    queryPropertyById.main({ propertyId: req.query.propertyId })
    .then(result => {
        if (!result) {
            res.status(404).send('Not found');
            return;
        }
        const parsedData = JSON.parse(result);
        res.send(parsedData);
    })
    .catch(err => {
        console.error({ err })
        res.status(404).send('Not found');
    })
})

// Get properties by city
app.get('/get-properties-by-city', function (req, res) {
    if (!req.query.city) {
        res.status(400).send('city is required');
        return;
    }
    queryPropertiesByCity.main({ city: req.query.city })
    .then(result => {
        const parsedData = JSON.parse(result);
        res.send(parsedData);
    })
    .catch(err => {
        console.error({ err })
        res.status(500).send('FAILED TO GET DATA!')
    })
})

// Add a new property
app.post('/add-property', function (req, res) {
    addProperty.main(req.body)
    .then(result => {
        res.send({ message: 'Created successfully' })
    })
    .catch(err => {
        console.error({ err })
        res.status(500).send('FAILED TO LOAD DATA!')
    })
})

// Update property
app.post('/update-property', function (req, res) {
    updateProperty.main(req.body)
    .then(result => {
        res.send({ message: 'Updated successfully' })
    })
    .catch(err => {
        console.error({ err })
        res.status(500).send('FAILED TO LOAD DATA!')
    })
})

app.listen(3000, () => console.log('Server is running at port 3000'))