import fs from "fs";
import * as d3 from "d3";
import usGridPoints from "./usGridPoints.js";

const spacing = [5, 10, 20, 50, 100];
(async () => {
  for (let miles of spacing) {
    console.log({ miles });
    const pointsContiguous = await usGridPoints(miles, true);
    fs.writeFileSync(
      `./output/contiguous/us-grid-points-${miles}mi.csv`,
      d3.csvFormat(pointsContiguous)
    );

    const pointsNonContiguous = await usGridPoints(miles, false);
    fs.writeFileSync(
      `./output/non-contiguous/us-grid-points-${miles}mi.csv`,
      d3.csvFormat(pointsNonContiguous)
    );
  }
})();
