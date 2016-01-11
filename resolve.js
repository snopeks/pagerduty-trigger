#!/usr/bin/env node

var resolve = require('./main').resolve,
	chalk   = require('chalk');

if (process.argv.length < 3) {
	console.error(chalk.red('USAGE: ./trigger.js alert-id'));
	process.exit(1);
}

var id = process.argv[2];
resolve(id, function(err, response) {

	if (err) {
		console.error(chalk.red(err.message));
		process.exit(1);
	}

	console.log('Incident resolved: ' + chalk.blue(response.incident_key));
});
