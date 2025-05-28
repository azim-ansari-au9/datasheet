const Policy = require("../models/Policy");
const PolicyCategory = require("../models/PolicyCategory");
const Carrier = require("../models/Carrier");
const User = require("../models/User");
const Account = require("../models/Account");
const Agents = require("../models/Agents");

module.exports = {
	searchUser: async (req, res) => {
		try {
			let { name } = req.query;
			if (!name) {
				return res
					.status(400)
					.json({ statusCode: 400, message: `Name is required` });
			}
			let userData = await User.find(
				{ firstName: new RegExp(name, "i") },
				{ _id: 1 }
			).lean();
			let userIds = userData?.map((id) => id?._id);
			// get here account and agent data for the user
			let accountData = await Account.find(
				{ userId: { $in: userIds } },
				{ __v: 0 }
			).lean();
			let agentData = await Agents.find(
				{ userId: { $in: userIds } },
				{ __v: 0 }
			).lean();
			let userDataWithPolicies = await Policy.find(
				{ userId: { $in: userIds } },
				{ __v: 0 }
			)
				.populate("categoryId", "categoryName")
				.populate(
					"userId",
					"firstName email dob address phoneNumber state zipCode email gender userType"
				)
				.populate("carrierId", "companyName");
			// Attach them manually to each user
			const enrichedUsers = userData.map((user) => {
				return {
					...user,
					...userDataWithPolicies[0]._doc,
					accounts: accountData.filter(
						(acc) => acc.userId.toString() === user._id.toString()
					)[0],
					agents: agentData.filter(
						(ag) => ag.userId.toString() === user._id.toString()
					)[0],
				};
			});
			return res.status(200).json({
				statusCode: 200,
				message: "Successful",
				data: enrichedUsers,
			});
		} catch (error) {
			return res.status(500).json({ statusCode: 500, message: error?.message });
		}
	},
	groupPoliciesPerUser: async (req, res) => {
		try {
			let result = await Policy.aggregate([
				{
					$lookup: {
						from: "users",
						localField: "userId",
						foreignField: "_id",
						as: "user",
					},
				},
				{
					$unwind: {
						path: "$user",
						preserveNullAndEmptyArrays: true,
					},
				},

				{
					$lookup: {
						from: "carriers",
						localField: "carrierId",
						foreignField: "_id",
						as: "carrier",
					},
				},
				{
					$unwind: {
						path: "$carrier",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$lookup: {
						from: "policycategories",
						localField: "categoryId",
						foreignField: "_id",
						as: "category",
					},
				},
				{
					$unwind: {
						path: "$category",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$group: {
						_id: "$user._id",
						firstName: { $first: "$user.firstName" },
						email: { $first: "$user.email" },
						totalPolicies: { $sum: 1 },
						policies: {
							$push: {
								policyNumber: "$policyNumber",
								startDate: "$startDate",
								endDate: "$endDate",
								carrier: "$carrier.companyName",
								category: "$category.categoryName",
							},
						},
					},
				},
			]);
			return res
				.status(200)
				.json({
					statusCode: 200,
					message: "Fetched successfully",
					data: result,
				});
		} catch (error) {
			return res.status(500).json({ statusCode: 500, message: error?.message });
		}
	},
};
