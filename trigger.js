#!/usr/bin/env node

var trigger = require('./main'),
	chalk   = require('chalk');

if (process.argv.length < 3) {
	console.error(chalk.red('USAGE: pd-trigger "your alert text here"'));
	process.exit(1);
}

var message = process.argv[2];
trigger(message, function(err, id) {

	if (err) {
		console.error(chalk.red(err.message));
		process.exit(1);
	}

	console.log('Incident created: ' + chalk.blue(id));
});
