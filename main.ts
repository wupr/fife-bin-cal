import {
  getAddressData,
  getAddressUPRN,
  getAuthToken,
  getBinCalendar,
} from "./api-requests.ts";

if (Deno.args.length < 2) {
  console.error("Two arguments required: <postcode> <number>.");
  Deno.exit(1);
}

const postcode: string = Deno.args[0]?.toUpperCase()!;
const number: string = Deno.args[1]!;

// Fetch authorization token
const authToken = await getAuthToken();
if (!authToken) {
  console.error("Failed to get authorization token.");
  Deno.exit(1);
}

// Fetch address list
const addressList = await getAddressData(postcode, authToken);
if (!addressList) {
  console.error(`Failed to get address list for postcode '${postcode}'.`);
  Deno.exit(1);
}

// Select address
const addressRegExp = new RegExp(`^${number},`, "i");
const selectedAddress = addressList.find((a) => addressRegExp.test(a.label));
if (!selectedAddress) {
  console.error(
    `Failed to find address starting '${number}' for postcode '${postcode}'.`,
  );
  Deno.exit(1);
}
console.error(
  `Fetching collection dates for address '${selectedAddress.label}'.`,
);

// Fetch address UPRN
const addressUPRN = await getAddressUPRN(selectedAddress.value, authToken);
if (!addressUPRN) {
  console.error("Failed to get address profile.");
  Deno.exit(1);
}

// Fetch bin calendar
const binCalendar = await getBinCalendar(addressUPRN, authToken);
if (binCalendar === null) {
  console.error("Failed to get bin calendar.");
  Deno.exit(1);
}

// Print collection dates
for (const collection of binCalendar) {
  const collectionDate =
    new Date(collection.date + " UTC").toISOString().split("T")[0];
  const binType = collection.type;
  console.log(`${collectionDate}\t${binType}`);
}
