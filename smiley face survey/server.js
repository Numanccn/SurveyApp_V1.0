// Package list
const express = require ("express");
const moment = require ("moment");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const address = require("address");
const jsdom = require("jsdom");
const { after } = require("cheerio/lib/api/manipulation");
const { JSDOM } = jsdom;

// Package instances

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// Server intitialization

app.listen(3000, function(){
    console.log("Server is running");
});

// Database connection

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "hellokiel2021",
    database: "kfo_schwen",
    multipleStatements: true,
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Server is connected to the database");
});


// Client get request 

app.get("/", function(req, res){
    res.sendFile(__dirname + "/survey.html");
});


// Post request from client to the server

app.post("/", function(req, res){

    var user_rating = (req.body.feedback);
    var question = (req.body.question);
    
    var datetime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var mac_add = address.mac(function (err, addr) {
        return(addr);
    });

    var sql = mysql.format("SELECT * FROM tbl_mac WHERE mac_address=?", [mac_add]);

    con.query(sql, function(err, result){

        var id_for_mac = 0;
        if(result.length === 0){
            var sql = "insert into tbl_mac (mac_address) values ('" + mac_add +"')";
            con.query(sql, function(err2, result){
                if(err2) throw err2;
                sql = mysql.format("SELECT * FROM tbl_mac WHERE mac_address=?", [mac_add]);
                con.query(sql, function(err3, result){
                    if(err3) throw err3;
                    id_for_mac = result[0].mac_id;
                    afterProcessMacAddress(id_for_mac, req);
                })

            })
            
        } else{
            id_for_mac = result[0].mac_id;
            afterProcessMacAddress(id_for_mac, req);
        }

        
    })
    
    console.log(question);
    console.log(user_rating);
    console.log(datetime);
    res.status(204).send();
});

function afterProcessMacAddress(id_for_mac, req){

    sql = mysql.format("SELECT * FROM tbl_survey WHERE question=?", [req.body.question]);
    var id_for_question = 0;

    con.query(sql, function(err, result){
        
        if(result.length === 0){
            throw new Error("Question does't exists in the table tbl_survey!");
        }else{
            id_for_question = result[0].question_id;
            afterProcessQuestion(id_for_mac, id_for_question, req)
        }
    })


}

function afterProcessQuestion(id_for_mac, id_for_question, req){
    var datetime = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    var sql = "insert into tbl_survey_data (mac_id, question_id, user_rating, time_stamp) values (' "+ id_for_mac +  " ','" + id_for_question + "', ' " + req.body.feedback +  " ', ' " + datetime +" ' )";
    con.query(sql, function(err, result){
        if(err) throw err;
    })

}