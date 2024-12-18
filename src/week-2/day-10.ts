// SPDX-License-Identifier: GPL-3.0-or-later
import { Location, OpenFileLineByLineAsArray } from "../helper.ts";

function printUsage() {
  console.log("Usage: day-9.ts [filename]");
}

// Parse the input
// Mostly just removes whitespace
function parse(lines: string[]): string[] {
  const topographic_map: string[] = [];

  for (const line of lines) {
    const trimmed_line = line.trim();
    if (trimmed_line !== "") {
      topographic_map.push(trimmed_line);
    }
  }

  return topographic_map;
}

// Get score of a specific trailhead
function trailheadLoop(
  topographic_map: string[],
  starting_index: Location,
  goal: string,
  allow_multiple_paths: boolean,
): number {
  const current_number = parseInt(
    topographic_map[starting_index.y][starting_index.x],
  );

  // If current number is 9 stop there
  if (current_number === 9) {
    // Convert into array because otherise you can't modify it
    if (allow_multiple_paths === false) {
      const copy = [...topographic_map[starting_index.y]];
      copy[starting_index.x] = ".";
      topographic_map[starting_index.y] = copy.join("");
    }

    return 1;
  }

  const next_number = (current_number + 1).toString();

  const possible_movement: Location[] = [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];

  let score: number = 0;
  for (let i = 0; i < possible_movement.length; i++) {
    const to_test: Location = {
      x: starting_index.x + possible_movement[i].x,
      y: starting_index.y + possible_movement[i].y,
    };

    if (0 <= to_test.y && to_test.y < topographic_map.length) {
      if (0 <= to_test.x && to_test.x < topographic_map[to_test.y].length) {
        // If the current one is indeed to next number update score
        if (topographic_map[to_test.y][to_test.x] === next_number) {
          score += trailheadLoop(
            topographic_map,
            to_test,
            goal,
            allow_multiple_paths,
          );
        }
      }
    }
  }

  return score;
}

// Wrapper for trailheadLoop since it modifies the topographic_map
function getTrailheadScore(
  topographic_map: string[],
  starting_index: Location,
  goal: string,
  allow_multiple_paths: boolean,
) {
  if (allow_multiple_paths === true) {
    return trailheadLoop(
      topographic_map,
      starting_index,
      goal,
      allow_multiple_paths,
    );
  }

  const copy = structuredClone(topographic_map);
  return trailheadLoop(copy, starting_index, goal, allow_multiple_paths);
}

function getSumOfTrailheads(
  topographic_map: string[],
  allow_multiple_paths: boolean,
) {
  let score = 0;

  for (let y = 0; y < topographic_map.length; y++) {
    for (let x = 0; x < topographic_map[y].length; x++) {
      if (topographic_map[y][x] === "0") {
        const starting_index: Location = { x, y };
        score += getTrailheadScore(
          topographic_map,
          starting_index,
          "9",
          allow_multiple_paths,
        );
      }
    }
  }

  return score;
}

async function main() {
  const filename = Deno.args[0];
  if (filename == null) {
    printUsage();
    Deno.exit(1);
  }

  const lines = await OpenFileLineByLineAsArray(filename);

  const topographic_map = parse(lines);
  const part_one = getSumOfTrailheads(topographic_map, false);
  const part_two = getSumOfTrailheads(topographic_map, true);

  console.log(`sum of all trailheads: ${part_one}`);
  console.log(
    `sum of all trailheads while allowing multiple paths for one same trail: ${part_two}`,
  );
}

main();
