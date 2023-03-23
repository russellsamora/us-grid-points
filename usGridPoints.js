import fs from "fs";
import * as d3 from "d3";
import * as topojson from "topojson-client";

const MILES_IN_LAT = 69.172;
const MILES_IN_LON = 54.6;

export default async function usGridPoints(miles = 100, contiguous = false) {
  const stepLat = miles / MILES_IN_LAT;
  const stepLon = miles / MILES_IN_LON;

  const states = JSON.parse(fs.readFileSync("./states.json", "utf8"));
  const exclude = ["72", "78"].concat(contiguous ? ["02", "15"] : []);

  const statesClean = {
    ...states.objects.states,
    geometries: states.objects.states.geometries.filter(
      (d) => !exclude.includes(d.properties.STATEFP)
    ),
  };

  const statesGeo = topojson.feature(states, statesClean);

  const longitudes = d3.range(-180, -60, stepLon);
  const latitudes = d3.range(18, 80, stepLat).reverse();

  const flat = longitudes
    .map((longitude) => latitudes.map((latitude) => ({ latitude, longitude })))
    .flat();

  const inBounds = flat.filter((d) =>
    d3.geoContains(statesGeo, [d.longitude, d.latitude])
  );

  return inBounds;
}
