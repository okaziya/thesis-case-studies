const faker = require("faker");
import { getDb } from "./getDb";

const NUM_ORDERS_TO_GENERATE = 1000;
//generate orders
const orders = Array.from({ length: NUM_ORDERS_TO_GENERATE }, () => {
  const items = Array.from(
    { length: faker.number.int({ min: 1, max: 5 }) },
    () => ({
      name: faker.commerce.product(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      price: faker.datatype.float({ min: 1, max: 1000, precision: 0.01 }),
    })
  );

  const products = Array.from(
    { length: faker.number.int({ min: 1, max: 5 }) },
    () => faker.commerce.product()
  );

  return {
    // customerName: faker.name.findName(),
    // address: faker.address.streetAddress(),
    // items,
    products,
    orderDate: faker.date.past(),
    // Add other standard fields for an order
  };
});

export async function createOrders() {
  const db = await getDb();
  console.log("connected to db");
  const collectionOrders = db.collection("orders");

  const result = await collectionOrders.insertMany(orders);
  console.log(
    `${result.insertedCount} documents inserted into the orders collection`
  );
}


// db.orders.find({"itemNames.1": "Car"}, {"itemNames": {"$slice": 2}})