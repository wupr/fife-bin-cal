export default {
  async fetch(req) {
    const url = new URL(req.url);

    const dateRequested = url.pathname === "/next-date";
    const typeRequested = url.pathname === "/next-type";
    if (!dateRequested && !typeRequested) {
      return new Response("Not found", { status: 404 });
    }

    const tsvFile = Deno.args[0];
    if (!tsvFile) {
      console.error("No TSV file specified.");
      return new Response("Internal server error", { status: 500 });
    }

    let dates;
    try {
      dates = (await Deno.readTextFile(tsvFile)).split("\n");
    } catch (_e) {
      console.error(`Error reading '${tsvFile}'.`);
      return new Response("Internal server error", { status: 500 });
    }

    const { date, index } = getFirstNonPastDate(dates);
    if (!date) {
      return new Response("No future collection dates found", { status: 500 });
    }

    const responseText = dateRequested
      ? date
      : getTypes(dates, date, index).join(" and ");
    return new Response(responseText, { status: 200 });
  },
} satisfies Deno.ServeDefaultExport;

function getFirstNonPastDate(dates: string[]) {
  const today = new Date().toISOString().split("T")[0]!;
  for (const [i, row] of dates.entries()) {
    const date = row.split("\t")[0]!;
    if (date >= today) {
      return { date, index: i };
    }
  }
  return { date: null, index: -1 };
}

function getTypes(dates: string[], date: string, startIndex: number) {
  const endIndex = dates.entries().drop(startIndex).find(([_, row]) =>
    !row.startsWith(date)
  )?.[0];
  const types = dates.slice(startIndex, endIndex).map((row) =>
    row.slice(row.indexOf("\t") + 1, row.indexOf(" / "))
  );
  return types;
}
