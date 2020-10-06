const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({
	path: './config.env',
});

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);

mongoose
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then((con) => {
		console.log(con.connections);
		console.log('DB Connection to Atlas Successful');
	});

// console.log(process.env);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App is now running on port ${port}`);
});
