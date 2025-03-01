import { PrismaClient } from "@prisma/client";
import { CityOption, Clue, RandomClueResponse } from "./city.model";

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Gets a random clue from a random city and provides multiple city options
 * @param sessionId The session ID to validate
 * @returns Random clue data with options
 */
export async function getRandomClue(
  sessionId: string
): Promise<RandomClueResponse> {
  try {
    // Validate session exists and is active
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw { statusCode: 404, message: "Session not found" };
    }

    if (!session.is_active) {
      throw { statusCode: 403, message: "Session is inactive" };
    }

    // Get a random city
    const citiesCount = await prisma.city.count();
    const skip = Math.floor(Math.random() * citiesCount);

    const randomCity = await prisma.city.findFirst({
      skip: skip,
    });

    if (!randomCity) {
      // add retry here
      throw { statusCode: 500, message: "No cities found in database" };
    }

    // Parse the clues from JSON
    const clues = randomCity.clues as unknown as Clue[];

    // Get a random clue from the city
    const randomClueIndex = Math.floor(Math.random() * clues.length);
    const randomClue = clues[randomClueIndex];

    // Get all other cities first
    // Add this to a cache of all cities to avoid unnecessary database queries
    const allOtherCities = await prisma.city.findMany({});

    // Make sure we have enough cities
    if (allOtherCities.length < 3) {
      throw {
        statusCode: 500,
        message: "Not enough cities in database for options",
      };
    }

    // Shuffle the cities and take the first 3
    shuffleArray(allOtherCities);
    const otherCities = allOtherCities.slice(0, 3);

    // Create options array with correct city and 3 random cities
    const correctOption: CityOption = {
      city: randomCity.city,
      country: randomCity.country,
    };

    const otherOptions: CityOption[] = otherCities.map((city) => ({
      city: city.city,
      country: city.country,
    }));

    // Combine and shuffle options
    const allOptions = [...otherOptions, correctOption];
    shuffleArray(allOptions);

    return {
      clue: randomClue.value,
      city_id: randomCity.id,
      options: allOptions,
    };
  } catch (error) {
    console.error("Error getting random clue:", error);
    throw error;
  }
}

/**
 * Shuffles array in place using Fisher-Yates algorithm
 * @param array Array to shuffle
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
