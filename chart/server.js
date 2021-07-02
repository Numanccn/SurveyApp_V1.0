// Package list
const express = require ("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const app = express();
const starRatings = require('star-ratings');
const util = require('util');
const { prependListener } = require("process");



// Package instances

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// Server intitialization

app.listen(3006, function(){
    console.log("Chart server is running");
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
    console.log("Chart server is connected to the database");
});

const query = util.promisify(con.query).bind(con)

app.get("/", function(req, res){

    res.sendFile(__dirname + "/chart.html");

});


// Fetching data for bar chart

app.get('/fetchData', async (req, res) =>{

    returnData =  []

    let sqlQuery = "select * from tbl_survey_data"
    let ratingData = []
    let questionIds = []
    
    //We assume maximum Question_ID < 10

    for(let i = 0; i<10; i++){
        ratingData.push([0,0,0,0,0])
    }

    try {
        const result = await query(sqlQuery)

        for (let i = 0; i<result.length; i++){
            let index = questionIds.indexOf(result[i].question_id)
            if(index === -1){
                questionIds.push(result[i].question_id)
            }
            ratingData[result[i].question_id][result[i].user_rating - 1]+=1
        }

        
        for(let i = 0; i<questionIds.length; i++){
            const res = await query("select question from tbl_survey where question_id = " + questionIds[i])
      

            let obj = {
                questionID: questionIds[i],
                name: res[0].question,
                data: ratingData[questionIds[i]]
            }
            returnData.push(obj)
        }

        

        
    } catch(err) {
        console.log("Error: ", err)
    }
    
    return res.json(returnData)

});


// Fetching data for time Series

app.get('/fetchTimeSeriesData', async (req, res) =>{
    try {
        //Get All Questions:
        const questionData = await query("select * from tbl_survey")
        console.log("QuestionData = ", questionData)
        var questionIDs = []
        for(let i = 0; i<questionData.length; i++){
            questionIDs.push(questionData[i].question_id)
        }
        console.log("QuestionIDS: ", questionIDs)



        sqlStr = 'select * from tbl_survey_data'
        const result = await query(sqlStr)
        var retData = {}
        var lebel = []

        fetchedData = []

        for (let i = 0; i<result.length; i++){
            curDay = result[i].time_stamp.toString().substring(4,15)
            let index = lebel.indexOf(curDay)
            if(index == -1){
                lebel.push(curDay)
            }

            if(retData[curDay] === undefined){
                retData[curDay] = {}
                for(let q = 0; q<questionIDs.length; q++){
                    retData[curDay][questionIDs[q]] = 0
                }
                
            }

            if(retData[curDay][result[i].question_id] === undefined){
                retData[curDay][result[i].question_id] = 1
            }else{
                retData[curDay][result[i].question_id] +=1
            }

        }


        console.log("retData: ", retData)
        //lebel data is ready




        var preProcessing = {}

        for(let i = 0; i<lebel.length; i++){
            let curKeys = Object.keys(retData[lebel[i]])
            for(let j = 0; j<curKeys.length; j++){
                if (preProcessing[curKeys[j]] === undefined){
                    preProcessing[curKeys[j]] = []
                    preProcessing[curKeys[j]].push(retData[lebel[i]][curKeys[j]])
                }else{
                    preProcessing[curKeys[j]].push(retData[lebel[i]][curKeys[j]])
                }
            }

        }

        let qKeys = Object.keys(preProcessing);

        for(let i = 0; i<qKeys.length; i++){
            const res = await query("select question from tbl_survey where question_id = " + qKeys[i])
            let obj = {
                questionID: qKeys[i],
                name: res[0].question,
                data: preProcessing[qKeys[i]],
                type: 'line'
            }
            fetchedData.push(obj)
        }

        
        
    } catch(err) {
        console.log("Error: ", err)
    }
    return res.json({fetchedData, lebel})
});


// Fetching data for pie chart

