# Fife Council Bin Calendar Look-up

A tool that looks up the Fife Council's bin collection dates.

## Motivation

The author found the Fife Council's bin calendar [search tool](https://www.fife.gov.uk/services/forms/bin-calendar) annoying to use.
Usually, one needs to visit the webpage in a browser, enter the postcode, click search, select the address from a list, and wait for the table of collection dates to load.
The URL of the webpage is never updated, so bookmarking does not help.

The code in this repository automates the process by making direct API requests.

This is version 2 of the tool, adapted from a Python-based [fork](https://github.com/DE0CH/fife-bin-cal/tree/6dedcca7debdd0ce7a4343aea0bd77369ca91465) of the original version.
The original version uses [Playwright](https://playwright.dev/) and is available on the "v1" branch.

## Usage

### Installing Deno

See [Deno's official guide](https://docs.deno.com/runtime/).
Other Javascript runtimes should also work, although modification to the code is required.

### Running

Clone this repository and run

```sh
deno run --allow-net main.ts <postcode> <number>
```

The script `main.ts` takes two positional arguments.
Both arguments are case-insensitive.
The second argument `<number>` is the part of the address before the first comma, as displayed when using the look-up webpage.
Usually it is the house number.

For example, running
```sh
deno run --allow-net main.ts 'KY16 9AJ' 'College Gate'
```
resulted in the following output on 2025-02-23:
```text
Fetching collection dates for address 'College Gate, North Street, St Andrews, Fife, KY16 9AJ'.
2025-03-04      Landfill / Blue Bin
2025-03-18      Landfill / Blue Bin
2025-04-01      Landfill / Blue Bin
2025-04-15      Landfill / Blue Bin
```

With a good Internet connection, this should take less than 5 seconds to run.

The first line is printed to stderr. The rest is printed to stdout, with a tab separating the date and the bin type in each line.

### Compiling

The script can also be compiled using Deno, creating an executable binary.

```sh
deno compile --allow-net main.ts
```

Cross-compiling is also supported, see [Deno's documentation](https://docs.deno.com/runtime/reference/cli/compile/#cross-compilation).

## License

The source code of this tool is distributed under the terms of Apache License, Version 2.0.
See [LICENSE](LICENSE) for details.
