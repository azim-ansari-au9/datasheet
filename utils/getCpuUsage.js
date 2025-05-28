const os = require("os");

module.exports = {
	getCPUUsage:  () => {
		try {
			const cpus = os.cpus(); // returns an array of objects of each CPU core
			let idle = 0;
			let total = 0;

			cpus.forEach((core) => {
				for (type in core.times) {
					total += core.times[type];
				}
				idle += core.times.idle;
			});

			const idleAvg = idle / cpus.length;
			const totalAvg = total / cpus.length;

			const usage = 100 - Math.floor((idleAvg / totalAvg) * 100);

            console.log("usage::", usage)
			return usage;
		} catch (error) {
			console.log("Error inside the getCPUUsage", error);
		}
	},
};
