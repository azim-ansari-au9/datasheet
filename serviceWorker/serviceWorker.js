const fs = require("fs");
const csv = require("csv-parser");
const { workerData, parentPort } = require("worker_threads");
const dotenv = require("dotenv");
const User = require("../models/User");
const Agents = require("../models/Agents");
const Account = require("../models/Account");
const PolicyCategory = require("../models/PolicyCategory");
const Carrier = require("../models/Carrier");
const Policy = require("../models/Policy");
const mongoose = require("mongoose");
const { mongoConnectionInitialize } = require("../connections/db");

dotenv.config();
console.log("object", process.env.DATABASE_URI);

let BATCH_SIZE = 25;
(async () => {
	try {
		console.log("File path:", workerData.filePath);
		mongoConnectionInitialize();
		const results = [];
		fs.createReadStream(workerData.filePath)
			.pipe(csv())
			.on("data", (row) => results.push(row))
			.on("end", async () => {
				console.log("Total rows to process:", results.length);
				if (!results.length) {
					parentPort.postMessage("No data to insert");
					return;
				}
				try {
					for (let i = 0; i < results.length; i += BATCH_SIZE) {
						const batch = results.slice(i, i + BATCH_SIZE);

						const users = [];
						const agents = [];
						const accounts = [];
						const policies = [];

						for (const row of batch) {
							users.push({
								firstName: row["firstname"],
								dob: row["dob"],
								address: row["address"],
								phoneNumber: row["phone"],
								state: row["state"],
								zipCode: row["zip"],
								email: row["email"],
								gender: row["gender"],
								userType: row["userType"],
                                agent: row["agent"],
                                account_name: row["account_name"]
							});
						}
						console.log("users?.lenth", users.length);
						const insertedUsers = await User.insertMany(users);

						for (let j = 0; j < insertedUsers.length; j++) {
							const user = insertedUsers[j];
							const row = batch[j];

							agents.push({
								agentName: row["agent"],
								userId: user._id,
							});

							accounts.push({
								accountName: row["account_name"],
								userId: user._id,
							});

							// Upsert category
							const category = await PolicyCategory.findOneAndUpdate(
								{ categoryName: row["category_name"] },
								{ $set: { categoryName: row["category_name"] } },
								{ new: true, upsert: true }
							);

							// Upsert carrier
							const carrier = await Carrier.findOneAndUpdate(
								{ companyName: row["company_name"] },
								{ $set: { companyName: row["company_name"] } },
								{ new: true, upsert: true }
							);
                            
                            // policies carrier
							policies.push({
								policyNumber: row["policy_number"],
								startDate: new Date(row["policy_start_date"]),
								endDate: new Date(row["policy_end_date"]),
								userId: user._id,
								categoryId: category._id,
								carrierId: carrier._id,
							});
						}

						await Agents.insertMany(agents);
						await Account.insertMany(accounts);
						await Policy.insertMany(policies);

						console.log(`Batch ${i / BATCH_SIZE + 1} inserted`);
					}

					parentPort.postMessage(
						"Data inserted in batches using worker threads"
					);
				} catch (err) {
					console.error("Error during batch insert:", err.message);
					parentPort.postMessage(`Insert error: ${err.message}`);
				}
			});
	} catch (error) {
		console.log("Worker top-level error:", error.message);
		parentPort.postMessage(`Worker error: ${error.message}`);
	}
})();

dotenv.config();
