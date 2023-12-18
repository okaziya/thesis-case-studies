import { faker } from "@faker-js/faker";
import { getDb } from "./getDb";

type Review = {
  rating: number;
  comment: string;
  photos: string[]
  createdOn: Date
  reviewer: {
    firstName: string;
    lastName: string;
    gender: string
  };
}

type Product = {
  productId: string;
  name: string;
  descriptiveName: string;
  description: string;
  price: number;
  material: string;
  department: string;
  reviews: Review[];
};



// db.products.find(
// {
//   name: "Car",
//   'reviews': {
//     $elemMatch: {
//       rating: { $gt: 4 },
//       createdOn: { $gt: new Date('2022-02-05') }
//     }
//   },
//   'reviews.photos.3': { $exists: true }
// },
// { price: 1, description: 1, "reviews.comment": 1, "reviews.photos": 1 }).sort({ price: 1 }).limit(5)

const numberOfPhotos = faker.number.int({ min: 0, max: 5 });

export function createRandomProduct(): Product {
  const generateReview = (): Review => ({
    rating: faker.number.int({ min: 1, max: 5 }),
    comment: faker.hacker.phrase(),
    photos: Array.from({ length: numberOfPhotos }, () => faker.image.imageUrl()),
    createdOn: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' }),
    reviewer: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: faker.person.sex(),
    }
  });

  const reviews: Review[] = Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, generateReview)

  return {
    productId: faker.string.uuid(),
    description: faker.commerce.productDescription(),
    descriptiveName: faker.commerce.productName(),
    name: faker.commerce.product(),
    price: parseInt(faker.commerce.price({ min: 100, max: 10000, dec: 0 })),
    department: faker.commerce.department(),
    material: faker.commerce.productMaterial(),
    reviews,
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
