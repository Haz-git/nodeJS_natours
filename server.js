/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
	path: './config.env',
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
	'<PASSWORD>',
	process.env.DATABASE_PASSWORD
);

mongoose
	//Local connection: .connect(process.env.DATABASE_LOCAL, {})
	.connect(DB, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => console.log('DB Connection to Atlas Successful'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`App is now running on port ${port}`);
});