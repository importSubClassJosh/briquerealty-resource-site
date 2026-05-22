# BriqueRealty.com Resource Site

Static Georgia real estate education/resource site for agents, investors, buyers, sellers, and property professionals.

## Commands

- `npm run build` regenerates the static site.
- `npm run build:squarespace` regenerates the static site and `dist/squarespace-import.xml`.
- `npm run serve` previews the generated site at `http://127.0.0.1:4173/`.

## Publishing Notes

The live `www.briquerealty.com` domain is currently hosted on Squarespace. The `dist/squarespace-import.xml` file is a WordPress-compatible import package intended for Squarespace's content importer. Image URLs in that import point to the public GitHub raw asset paths so Squarespace can display or ingest the images during import.
