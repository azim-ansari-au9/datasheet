const { searchUser, groupPoliciesPerUser } = require("../controllers/retrivePolicy");
const { scheduleMessageInsertion } = require("../controllers/schedule");
const { bulkUploadCsv } = require("../controllers/uploadController");

const express = require("express");
const router = express.Router();

// insert here csv file
router.post("/insert", bulkUploadCsv);

// search user here
router.get('/search', searchUser)
// aggregated policy by user
router.get('/getPolicy', groupPoliciesPerUser)

// scheduler API
router.post('/schedule-insert', scheduleMessageInsertion)
module.exports = router
