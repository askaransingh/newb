// // // import mongoose from "mongoose";

// // // const tractorConnection = mongoose.createConnection(process.env.TRACTOR_DB_URI, {
// // //   useNewUrlParser: true,
// // //   useUnifiedTopology: true,
// // // });

// // // tractorConnection.on("connected", () => {
// // //   console.log("✅ Connected to Tractor Database");
// // // });

// // // export default tractorConnection;

// // // export { tractorConnection };

// // import mongoose from "mongoose";

// // const tractorConnection = mongoose.createConnection(process.env.TRACTOR_DB_URI, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // });

// // tractorConnection.on("connected", () => {
// //   console.log("✅ Connected to Tractor Database");
// // });

// // tractorConnection.on("error", (err) => {
// //   console.error("❌ Tractor DB connection error:", err);
// // });

// // export default tractorConnection;

// import mongoose from "mongoose";

// const uri = process.env.TRACTOR_DB_URI;

// if (!uri) {
//   console.error("❌ TRACTOR_DB_URI is missing in .env file");
// }

// const tractorConnection = mongoose.createConnection(uri); // options no longer needed in Mongoose v7+

// tractorConnection.on("connected", () => {
//   console.log("✅ Connected to Tractor Database");
// });

// tractorConnection.on("error", (err) => {
//   console.error("❌ Tractor DB connection error:", err);
// });

// export default tractorConnection;

// database.js
// import mongoose from "mongoose";

// export const connectToTractor = async () => {
//   try {
//     // const conn = await mongoose.connect("mongodb+srv://jaskaransingh70262_db_user:GjqIYkONPkICl5M9@cluster0.dzpy4yc.mongodb.net/myDatabaseName?retryWrites=true&w=majority", 
//      const conn = await mongoose.connect(process.env.TRACTOR_DB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     process.exit(1);
//   }
// };