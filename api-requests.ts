interface AddressCandidate {
  value: string;
  label: string;
}
interface BinCalendarEntry {
  colour: string;
  date: string;
  type: string;
}

const FIFE_COUNCIL_API_BASE_URL = "https://www.fife.gov.uk/api/";

export async function getAuthToken(): Promise<string | null> {
  const qeuryParams = new URLSearchParams({
    "preview": "false",
    "locale": "en",
  }).toString();
  const url = new URL(`citizen?${qeuryParams}`, FIFE_COUNCIL_API_BASE_URL);
  const response = await fetch(url);
  if (!response.ok) {
    return null;
  }
  console.error(response.ok);
  return response.headers.get("Authorization");
}

export async function getAddressData(
  postcode: string,
  authToken: string,
): Promise<AddressCandidate[] | null> {
  const qeuryParams = new URLSearchParams({
    "action": "propertysearch",
    "actionedby": "ps_3SHSN93",
    "loadform": "true",
    "access": "citizen",
    "locale": "en",
  }).toString();
  const url = new URL(`widget?${qeuryParams}`, FIFE_COUNCIL_API_BASE_URL);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      "name": "bin_calendar",
      "data": { "postcode": postcode },
      "email": "",
      "caseid": "",
      "xref": "",
      "xref1": "",
      "xref2": "",
    }),
    headers: {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Authorization": authToken,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()).data;
}

export async function getAddressUPRN(
  objectId: string,
  authToken: string,
): Promise<string | null> {
  const qeuryParams = new URLSearchParams({
    "objecttype": "property",
    "objectid": objectId,
  }).toString();
  const url = new URL(
    `getobjectdata?${qeuryParams}`,
    FIFE_COUNCIL_API_BASE_URL,
  );
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "*/*",
      "Authorization": authToken,
    },
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()).profileData["property-UPRN"];
}

export async function getBinCalendar(
  uprn: string,
  authToken: string,
): Promise<BinCalendarEntry[] | null> {
  const qeuryParams = new URLSearchParams({
    "action": "powersuite_bin_calendar_collections",
    "actionedby": "bin_calendar",
    "loadform": "true",
    "access": "citizen",
    "locale": "en",
  }).toString();
  const url = new URL(`custom?${qeuryParams}`, FIFE_COUNCIL_API_BASE_URL);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      "name": "bin_calendar",
      "data": { "uprn": uprn },
      "email": "",
      "caseid": "",
      "xref": "",
      "xref1": "",
      "xref2": "",
    }),
    headers: {
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Authorization": authToken,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    return null;
  }
  const { data: { results_returned, tab_collections } } = await response.json();
  if (results_returned !== "true") {
    return null;
  }
  return tab_collections;
}
