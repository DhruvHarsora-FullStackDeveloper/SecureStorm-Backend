import SQLite from "react-native-sqlite-storage";
const KEY = "SECURESTROME";

//connecting to Database
const db = SQLite.openDatabase(
	{
		name: "SecureStorm",
	},
	() => {},
	(error) => {
		console.log(error);
	}
);

//creating files table
export const createTable = () => {
	db.transaction((tx) => {
		tx.executeSql(
			"CREATE TABLE IF NOT EXISTS " +
				"UserFiles " +
				"(ID INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, location TEXT)",
			[],
			(sqlTxn, res) => {
				console.log("files table created.");
                return {result:1,msg:`File table created`};
			},
			(error) => {
				console.log("error on creating table ", error.message);
                return {result:0,msg:error.message};
			}
		);
	});
};

//? Inserts files to DB
//? Accepts name and location of file
//! returs returns result obejct 
export const insertFile = async (name, location) => {
	const encLocation = await encryptFile(location, KEY); //getting encrypted file location
	db.transaction((txn) => {
		txn.executeSql(
			"INSERT INTO user (name,location) VALUES (?,?)",
			[name, encLocation],
			(sqlTxn, res) => {
				console.log(`file ${name} added.`);
                return {result:1,msg:`file ${name} added.`};
			},
			(error) => {
				console.log("error Adding data ", error.message);
                return {result:0,msg:error.message};
			}
		);
	});
};


//! returns array of Files object on success 
//! On error returns empty array
export const GetAllFiles = () => {
	db.transaction((txn) => {
		txn.executeSql(
			"SELECT * FROM UserFiles order by id desc",
			[],
			(sqlTxn, res) => {
				console.log(`Files retrieved successfully`);
				let len = res.rows.length;

				if (len > 0) {
					let results = [];
					for (let i = 0; i < len; i++) {
						let item = res.rows.item(i);
						results.push({
							id: item.id,
							name: item.name,
							location: item.location,
						});
					}
					return results;
				}
			},
			(error) => {
				console.log("error on creating table ", error.message);
                return results;
			}
		);
	});
};

//! return decrypted file location 
//! On error returns empty array
export const GetFile = (id) => {
	db.transaction((txn) => {
		txn.executeSql(
			"SELECT name,location FROM UserFiles WHERE id=?",
			[id],
			(sqlTxn, res) => {
				console.log(`File retrieved successfully`);
				let len = res.rows.length;

				if (len > 0) {
					let results = [];
					let item = res.rows.item(0);
                    const name= item.name;
                    const location= item.location;

                    const decLocation = await decryptFile(location,KEY) // getting decrypted files 
					results.push({
						name,
                        decLocation
					});

					return results;
				}
			},
			(error) => {
				console.log("error on creating table ", error.message);
                return results;
			}
		);
	});
};
