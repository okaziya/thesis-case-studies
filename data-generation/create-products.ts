import { faker } from "@faker-js/faker";
import { getDb } from "./getDb";

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

export async function createProducts() {
  const db = await getDb();
  console.log("connected to db");
  const collectionProducts = db.collection("products");

  const result = await collectionProducts.insertMany(PRODUCTS);
  console.log(`${result.insertedCount} items inserted successfully.`);
}
