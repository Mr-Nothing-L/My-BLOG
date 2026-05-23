import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const notion = new Client({
  auth: process.env.NOTION_TOKEN || '',
});

const databaseId = process.env.NOTION_DATABASE_ID || '';

function getRichText(property) {
  if (!property) return '';
  if (property.type === 'rich_text') {
    return property.rich_text.map((t) => t.plain_text).join('');
  }
  if (property.type === 'title') {
    return property.title.map((t) => t.plain_text).join('');
  }
  return '';
}

function getDate(property) {
  if (!property || property.type !== 'date') return '';
  return property.date?.start || '';
}

function getMultiSelect(property) {
  if (!property || property.type !== 'multi_select') return [];
  return property.multi_select.map((t) => t.name);
}

function getCheckbox(property) {
  if (!property || property.type !== 'checkbox') return false;
  return property.checkbox;
}

async function fetchPosts() {
  if (!databaseId || !process.env.NOTION_TOKEN) {
    console.warn('⚠️ NOTION_TOKEN 或 NOTION_DATABASE_ID 未设置，使用空文章列表');
    return [];
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending',
        },
      ],
    });

    const posts = response.results.map((page) => ({
      id: page.id,
      title: getRichText(page.properties.Name),
      slug: getRichText(page.properties.Slug),
      date: getDate(page.properties.Date),
      tags: getMultiSelect(page.properties.Tags),
      summary: getRichText(page.properties.Summary),
      published: getCheckbox(page.properties.Published),
      content: getRichText(page.properties.Content),
    }));

    console.log(`✅ 从 Notion 获取了 ${posts.length} 篇文章`);
    return posts;
  } catch (error) {
    console.warn('❌ Notion API 调用失败:', error.message);
    console.warn('使用空文章列表继续构建');
    return [];
  }
}

async function main() {
  const posts = await fetchPosts();
  const outputPath = path.resolve(__dirname, '../public/posts.json');
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  console.log(`📝 文章数据已写入 ${outputPath}`);
}

main();
