const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully");
    
    const dbs = await mongoose.connection.db.admin().listDatabases();
    const dbExists = dbs.databases.some(db => db.name === 'blogapp');
    
    if (dbExists) {
      console.log("Database 'blogapp' found");
    } else {
      console.log("Database 'blogapp' will be created automatically on first operation");
    }
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});