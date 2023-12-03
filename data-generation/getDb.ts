

import { MongoClient, ServerApiVersion, MongoClientOptions, Db } from "mongodb";

require("dotenv").config();

// Connection URL
const uri = process.env.MONGO_URI ?? '';

// Database Name
const dbName = "cluster1";

const clientOptions: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  family: 4, // or 6, depending on your requirements
  hints: undefined, // or specify hints based on your needs
  localAddress: undefined, // specify a local address if needed
  localPort: undefined, // specify a local port if needed
  lookup: undefined, // specify a lookup function if needed
};



let clientPromise: Promise<MongoClient> | null = null

export const getDb = async (): Promise<Db> => {


	if (clientPromise == null) {
		const newClient = new MongoClient(uri, clientOptions)

		clientPromise = newClient.connect()
	}

    const client = await clientPromise

	return client.db(dbName)
}