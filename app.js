const express = require("express");
const dotenv = require("dotenv");
const { mongoConnectionInitialize } = require("./connections/db");
const indexRouter = require("./routes/index.js");
const { getCPUUsage } = require("./utils/getCpuUsage.js");
const { exec } = require("child_process");

// const getCpuUsage = require("./utils/getCpuUsage.js");
// const mongoose = require('./config/db');
// const cpuMonitor = require('./services/cpuMonitor');

dotenv.config();
const app = express();
// mongoConnection here
mongoConnectionInitialize();

// get cups
// getCPUUsage() // my system has 8 core CPU
app.use(express.json());
// write here logic to restart if usage is gearter than 70 %
setInterval(() => {
	let usage = getCPUUsage();
	// console.log("CPU usage exceeded 10%, restarting server...");
	// pm2 restart by name or id
	if (usage > 70) {
		exec("pm2 restart assessment_data_sheet", (err, stdout, stderr) => {
			if (err) console.error("Restart Error:", err);
		});
	}
}, 10000);

// routes
app.use("/api/v1", indexRouter);
// listen
const port = process.env.PORT || 3002;
app.listen(port, () => {
	console.log(`Server is running on ${port}`);
});
