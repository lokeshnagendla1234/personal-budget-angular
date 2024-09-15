const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;

app.use('/',express.static('public'));

app.get('/budget', (req, res) => {

    fs.readFile('./mybudget.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading mybudget.json:', err);
            return res.status(404).send('Budget file are not found');
        }
        const mybudget = JSON.parse(data);
        res.json(mybudget);
    });
});

app.get('/hello', (req,res) => {
    res.send('Hello World!');
});

app.listen(port,()=>{
    console.log(`Server is currently running on port ${port}`);
});