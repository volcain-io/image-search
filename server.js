'use strict'

const express = require('express')
const http = require('request')
const path = require('path')
const mongodb = require('mongodb');

const app = express()
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT || 8080
const dbURL = process.env.MONGOLAB_URI
const googleSearchAPIURI = process.env.GOOGLE_CS_URI
var dbCollection

// Use connect method to connect to the Server
const db = MongoClient.connect(dbURL, function(err, db) {
    if ( err )
        throw err

    dbCollection = db.collection('latest_search')

});

app.get('/', function(req, res) {
    res.sendFile( path.join(__dirname + '/views/index.html') )
})

app.get('/latest/', function(request, response) {
    // get latest search queries
    dbCollection.find( {}, { _id: 0 } ).sort( { "when": -1 } ).limit(10).toArray(function(err, data) {
        if ( err ) {
            console.error(err)
            response.json( [] )
        } else {
            response.json(data)
        }
    })
})

app.get('/:searchTerm', function(request, response) {
    console.log(request.params.searchTerm)
    console.log(request.query.offset)

    const searchTerm = request.params.searchTerm
    const offset = request.query.offset ? '&start=' + request.query.offset : ''

    // insert search query into database
    dbCollection.insertOne( { "term": searchTerm, "when": (new Date()).toISOString() } )

    // start REST api request
    http(
        {
            url: googleSearchAPIURI + "&q=" + searchTerm + offset,
            method: 'GET'
        },
        function(err, resp, body) {
            if ( err ) {
                console.error(err)
                response.json( [] )
            } else {
                var result = []

                if ( body ) {
                    var data = JSON.parse(body)

                    if ( data && data.items ) {
                        for ( let i = 0; i < data.items.length; i++ ) {
                            const item = data.items[i]
                            var newEntry = {}
                            newEntry.url = item.link
                            newEntry.snippet = item.snippet
                            newEntry.thumbnail = item.image.thumbnailLink
                            newEntry.context = item.image.contextLink
                            result.push(newEntry)
                        }
                    }
                }

                response.json(result)
            }
        }
    )
})

app.listen(port)