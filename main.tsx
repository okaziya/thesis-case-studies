import { MongoClient, ServerApiVersion, MongoClientOptions } from "mongodb";
import { faker } from "@faker-js/faker";
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

// Create a new MongoClient
const client = new MongoClient(uri, clientOptions);

type Product = {
  productId: string;
  name: string;
  descriptiveName: string;
  description: string;
  price: number;
  material: string;
  department: string;
};

export function createRandomProduct(): Product {
  return {
    productId: faker.string.uuid(),
    description: faker.commerce.productDescription(),
    descriptiveName: faker.commerce.productName(),
    name: faker.commerce.product(),
    price: parseInt(faker.commerce.price({ min: 100, max: 10000, dec: 0 })),
    department: faker.commerce.department(),
    material: faker.commerce.productMaterial(),
  };
}

export const PRODUCTS: Product[] = faker.helpers.multiple(createRandomProduct, {
  count: 10000,
});

async function createProducts() {
  try {
    await client.connect();
    console.log("connected");
    const database = client.db(dbName);
    const collection = database.collection("products");

    const result = await collection.insertMany(PRODUCTS);
    console.log(`${result.insertedCount} items inserted successfully.`);
  } finally {
    await client.close();
  }
}
// createProducts().catch(console.dir);

// npx ts-node main.tsx
