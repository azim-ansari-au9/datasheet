const path = require("path");
const { Worker } = require("worker_threads");

module.exports = {
	bulkUploadCsv: async (req, res) => {
		try {
			const filePath = path.join(
				__dirname,
				"../datasheet_Node_js_Assesment.csv"
			);
            console.log("filepath:::", filePath)
			const worker = new Worker(
				path.join(__dirname, "../serviceWorker/serviceWorker.js"),
				{
					workerData: { filePath },
				}
			);

			worker.on("message", (msg) => {
				return res.status(200).json({ statusCode: 200, message: msg });
			});
			worker.on("error", (err) => {
				return res.status(500).json({ statusCode: 500, message: err.message });
			});
			worker.on("exit", (code) => {
				if (code !== 0) {
					console.log(`Worker stopped with exit code ${code}`);
				}
			});
		} catch (error) {
            console.log("error::::", error)
			return res.status(500).json({
				statusCode: 500,
				message: `Something went wrong`,
				error: error?.message,
			});
		}
	},
};
