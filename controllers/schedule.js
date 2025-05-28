const Message = require("../models/Message.js");
const schedule = require("node-schedule");
module.exports = {
	scheduleMessageInsertion: async (req, res) => {
		try {
			let { message, date, time } = req.body;
			if (!message || !date || !time) {
				return res.status(400).json({
					statusCode: 400,
					message: `message, day and time is required`,
				});
			}
			let timeSchduledFor = new Date(`${date}T${time}:00`);
			if (isNaN(timeSchduledFor.getTime())) {
				return res
					.status(400)
					.json({ statusCode: 400, message: "Invalid day or time format" });
			}
			const newMessage = new Message({
				message,
				day: date,
				time,
				inserted: false,
			});

			await newMessage.save();

			// Schedule the message insertion
			console.log("timeSchduledFor:::", timeSchduledFor)
			console.log("current date and time::", new Date())
			schedule.scheduleJob(timeSchduledFor, async () => {
				console.log("Inserting scheduled message:", message);
				await ScheduledMessage.findByIdAndUpdate(newMessage._id, {
					inserted: true,
				});
			});

			return res
				.status(200)
				.json({ statusCode: 200, message: "Message scheduled successfully" });
		} catch (error) {
			return res.status(500).json({ statusCode: 500, message: error?.message });
		}
	},
};
