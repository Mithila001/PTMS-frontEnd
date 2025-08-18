import L from "leaflet";

/**
 * Parses a WKT LineString into an array of LatLngExpression objects.
 * Returns a tuple containing the parsed coordinates and a boolean indicating validity.
 * @param wktLineString The WKT LINESTRING string to parse.
 * @returns A tuple of [parsedPath, isValid]
 */
export const parseWKTLineString = (wktLineString: string): [L.LatLngExpression[], boolean] => {
  if (!wktLineString) {
    return [[], true];
  }

  const lineStringRegex = /LINESTRING\s*\(([^)]+)\)/;
  const match = wktLineString.match(lineStringRegex);

  if (!match) {
    return [[], false];
  }

  const coordinatesString = match[1];
  const coordinatePairs = coordinatesString.split(",").map((pair) => pair.trim());

  try {
    const latLngs = coordinatePairs.map((pair) => {
      const parts = pair.split(/\s+/).map(Number);
      if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
        throw new Error("Invalid coordinate pair.");
      }
      return L.latLng(parts[1], parts[0]);
    });
    return [latLngs, true];
  } catch (err) {
    return [[], false];
  }
};
