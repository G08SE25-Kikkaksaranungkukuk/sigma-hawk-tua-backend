// Run this:
// pnpx prisma migrate reset
// npx ts-node tests/dummy_blog.ts

import { prisma } from "../apps/config/prismaClient";

async function createDummyBlogs() {
  const nouns = ["cat", "dog", "car", "mountain", "river", "city", "robot", "pizza", "book", "computer"];
  const verbs = ["runs", "jumps", "flies", "eats", "writes", "reads", "explores", "builds", "creates", "discovers"];
  const adjs = ["quick", "lazy", "beautiful", "strange", "delicious", "ancient", "modern", "funny", "mysterious", "bright"];

  function random<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

  const interestIds = Array.from({ length: 17 }, (_, i) => i + 1); // 1-17 from seed.ts
  const blogs = Array.from({ length: 50 }, (_, i) => {
    const noun = random(nouns);
    const verb = random(verbs);
    const adj = random(adjs);
    // Assign 1-3 random interests per blog
    const numInterests = Math.floor(Math.random() * 3) + 1;
    const shuffled = interestIds.sort(() => 0.5 - Math.random());
    const blogInterests = shuffled.slice(0, numInterests);
    return {
      user_id: (i % 5) + 1,
      title: `The ${adj} ${noun} ${verb} (${i + 1})`,
      description: `This ${adj} ${noun} loves to ${verb}. Blog #${i + 1}.` + (i % 10 === 0 ? ' Special: amogus.' : ''),
      json_config: '{}',
      html_output: `<p>${adj} ${noun} ${verb} content for blog #${i + 1}</p>` ,
      blogInterests
    };
  });

  for (const blog of blogs) {
    // Create blog
    const created = await prisma.blog.create({ data: {
      user_id: blog.user_id,
      title: blog.title,
      description: blog.description,
      json_config: blog.json_config,
      html_output: blog.html_output
    }});
    // Create BlogInterest join records
    for (const interest_id of blog.blogInterests) {
      await prisma.blogInterest.create({ data: { blog_id: created.blog_id, interest_id } });
    }
  }

  console.log("50 dummy blogs with interests created.");
}

createDummyBlogs()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
