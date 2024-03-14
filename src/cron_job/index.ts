// insert seed data

import { PrismaClient } from '@prisma/client';
import Replicate from 'replicate';

const prisma = new PrismaClient();

async function main() {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY as string,
  });

  let response = await replicate.request("/hardware", {
    method: "GET",
  });
  const hardwares = await response.json();
  await prisma.hardware.deleteMany();
  await prisma.hardware.createMany({
    data: hardwares
  });

  response = await replicate.request("/collections", {
    method: "GET",
  });
  const collections = await response.json();
  let models: any[] = [];
  await prisma.collection.deleteMany()
  await prisma.model.deleteMany();
  await Promise.all(collections['results'].map(async (collection: any) => {
    const collectionCreated = await prisma.collection.create({
      data: collection
    });
    response = await replicate.request("/models", {
      method: "GET",
    });
    const collectionModels = await response.json();
    await Promise.all(collectionModels['results'].map(async (model: any) => {
      const existingModelIndex = models.findIndex((existingModel: any) => existingModel.url === model.url);
      if (existingModelIndex !== -1) {
        models[existingModelIndex].collection_id.push(collectionCreated.id);
      } else {
        models.push({
          ...model,
          collection_id: [collectionCreated.id]
        });
      }
    }));
  }));

  await prisma.model.createMany({
    data: models
  });

  await prisma.$disconnect();
}

main()
.catch((e) => {
    throw e;
})
.finally(async () => {
    await prisma.$disconnect();
});
