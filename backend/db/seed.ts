import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { generateId, ID_PREFIXES } from '../src/utils/id';

const prisma = new PrismaClient();

interface CityData {
  city: string;
  country: string;
  clues: {
    value: string;
    difficulty: string;
  }[];
  fun_fact: string[];
  trivia: string[];
}

async function main() {
  try {
    // Read the JSON data
    const dataPath = path.join(__dirname, '../../dataset/v1.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const cities: CityData[] = JSON.parse(rawData);

    console.log(`Found ${cities.length} cities in the dataset.`);
    
    // Delete all existing cities
    await prisma.city.deleteMany({});
    console.log('Cleared existing city data.');
    
    // Insert cities in batches to avoid overwhelming the database
    const batchSize = 20;
    let count = 0;
    
    for (let i = 0; i < cities.length; i += batchSize) {
      const batch = cities.slice(i, i + batchSize);
      
      // Process sequentially instead of in parallel to avoid race conditions
      for (const cityData of batch) {
        try {
          await prisma.city.upsert({
            where: {
              city_country: {
                city: cityData.city,
                country: cityData.country,
              },
            },
            update: {
              clues: cityData.clues,
              fun_fact: cityData.fun_fact,
              trivia: cityData.trivia,
            },
            create: {
              id: generateId(ID_PREFIXES.CITY),
              city: cityData.city,
              country: cityData.country,
              clues: cityData.clues,
              fun_fact: cityData.fun_fact,
              trivia: cityData.trivia,
            },
          });
          count++;
        } catch (error) {
          console.error(`Error processing city: ${cityData.city}, ${cityData.country}`, error);
        }
      }
      
      console.log(`Inserted ${count} cities so far...`);
    }
    
    console.log(`Seeding completed. Added ${count} cities to the database.`);
  } catch (error) {
    console.error('Error seeding the database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
