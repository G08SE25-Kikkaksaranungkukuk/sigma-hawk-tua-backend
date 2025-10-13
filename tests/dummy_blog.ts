// Run this:
// npx ts-node tests/dummy_blog.ts

import { prisma } from "../apps/config/prismaClient";

async function createDummyBlogs() {
  const nouns = ["cat", "dog", "car", "mountain", "river", "city", "robot", "pizza", "book", "computer"];
  const verbs = ["runs", "jumps", "flies", "eats", "writes", "reads", "explores", "builds", "creates", "discovers"];
  const adjs = ["quick", "lazy", "beautiful", "strange", "delicious", "ancient", "modern", "funny", "mysterious", "bright"];

  function random<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

  const blogs = Array.from({ length: 50 }, (_, i) => {
    const noun = random(nouns);
    const verb = random(verbs);
    const adj = random(adjs);
    return {
      user_id: (i % 5) + 1,
      title: `The ${adj} ${noun} ${verb} (${i + 1})`,
      description: `This ${adj} ${noun} loves to ${verb}. Blog #${i + 1}.` + (i % 10 === 0 ? ' Special: amogus.' : ''),
      json_config: '{}',
      html_output: `<p>${adj} ${noun} ${verb} content for blog #${i + 1}</p>`
    };
  });

  for (const blog of blogs) {
    await prisma.blog.create({ data: blog });
  }

  console.log("100 dummy blogs created.");
}

createDummyBlogs()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
