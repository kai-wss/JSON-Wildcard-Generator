const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path'); // Add this line

const app = express();
const port = 3000;

app.use(bodyParser.json());

const logDir = 'json_logs';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

app.use(express.static('public')); // Serve static files from the 'public' directory

app.post('/log-json-output', (req, res) => {
    const jsonOutput = req.body.jsonOutput;
    if (jsonOutput) {
        const timestamp = new Date().toISOString();
        const logFilePath = path.join(logDir, `log_${timestamp}.json`); // Use path.join to ensure correct file path

        try {
            const parsedJSON = JSON.parse(jsonOutput);
            fs.writeFileSync(logFilePath, JSON.stringify(parsedJSON, null, 2), 'utf8');
            res.status(200).send('JSON output logged successfully.');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error logging JSON output.');
        }
    } else {
        res.status(400).send('Invalid JSON output.');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
