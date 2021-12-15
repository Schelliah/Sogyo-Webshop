/**
 * Server side code using the express framework running on a Node.js server.
 * 
 * Load the express framework and create an app.
 */
const express = require('express');
const mysql = require('mysql2');
const app = express();

/** 
 * Host all files in the client folder as static resources.
 * That means: localhost:8080/someFileName.js corresponds to client/someFileName.js.
 */
app.use(express.static('client'));

/**
 * Allow express to understand json serialization.
 */
app.use(express.json());
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
  
var database = mysql.createConnection({host: "localhost",
user: "root",
password: "sogyo",
database: "sogyo_worksh"})

database.connect((error) => {
    if(error) throw error;
    console.log("Database Connected again");
    let query = "SELECT * FROM SogyoEvents";
    database.query(query,(error,result)=>{
        if(error) throw error;
        //console.log(result)
        console.log("done query test")
    });

});

async function getAllEventsFromDatabase(){
    let query = "SELECT * FROM SogyoEvents"
    return await queryDatabase(query);
}


async function queryDatabase(query){
    return new Promise ((resolve, reject) => {
        database.query(query,(error,result)=>{
            if(error) return reject(error);
            console.log(result)
            return resolve(result)
        });
    });
}

async function queryDatabase(query, data){
    return new Promise ((resolve, reject) => {
        database.query(query,data,(error,result)=>{
            if(error) return reject(error);
            console.log(result)
            return resolve(result)
        });
    });
}

async function saveTicket(currentTicket, orderID) {
    let ticketquery = 'INSERT INTO ticket SET ?';
    if( currentTicket.numberOfParents){
        let adult ={OrderID: orderID, name:currentTicket.nameAttraction,TypeTicket: 'Adult', amount: currentTicket.numberOfParents }
        await queryDatabase(ticketquery, [adult]);
    }
    if(currentTicket.numberOfChildren){
        let kid ={OrderID: orderID, name:currentTicket.nameAttraction,TypeTicket: 'Kid', amount: currentTicket.numberOfChildren }
        await queryDatabase(ticketquery, [kid]);
    }
    let amount = currentTicket.numberOfParents + currentTicket.numberOfChildren;
    let queryAvailableUpdate = 'Update SogyoEvents Set available = available - ? Where  SogyoEvents.`name`= ?' //use of ? instead of directly copying string name into sql query to avoid potntial sql injection
    await queryDatabase(queryAvailableUpdate, [amount,currentTicket.nameAttraction])
}

async function saveOrder(currentOrder){
    let orderquery = 'INSERT INTO orders SET ?'
    await queryDatabase(orderquery, {UserID: 1, DateOfPurchase:new Date().toISOString().slice(0, 19).replace('T', ' ')}) // only one user who is both customer and admin, as there isn't a login system implemented
    let getorderIDquery = 'SELECT LAST_INSERT_ID()'
    let orderID=await queryDatabase(getorderIDquery);
    orderID = orderID[0]['LAST_INSERT_ID()'];
    currentOrder.forEach(ticket => saveTicket(ticket, parseInt(orderID)));
}

/**
 * A route is like a method call. It has a name, some parameters and some return value.
 * 
 * Name: /api/attractions
 * Parameters: the request as made by the browser
 * Return value: the list of attractions defined above as JSON
 * 
 * In addition to this, it has a HTTP method: GET, POST, PUT, DELETE
 * 
 * Whenever we make a request to our server,
 * the Express framework will call one of the methods defined here.
 * These are just regular functions. You can edit, expand or rewrite the code here as needed.
 */
app.get("/api/attractions", async (request, response)  =>{
    console.log("Api call received for /attractions");
    let result = await getAllEventsFromDatabase();
    console.log("send events database")
    response.json(result)
});

app.post("/api/placeorder", jsonParser, async function (request, response) {
    console.log("Api call received for /placeorder");
    let currentOrder = request.body
    await saveOrder(currentOrder)
    /**
     * Send the status code 200 back to the clients browser.
     * This means OK.
     */
    response.sendStatus(200);
});

app.get("/api/myorders", function (request, response) {
    console.log("Api call received for /myorders");

    response.sendStatus(200);
});

app.get("/api/admin/edit", function (request, response) {
    console.log("Api call received for /admin/edit");

    response.sendStatus(200);
});


app.listen(8000, () => console.log('Example app listening on port 8000!'));