import { generate } from 'critical';

async function buildCritical() {
  try {
    await generate({
      base: 'dist/',
      src: 'index.html',      // HTML file inside dist
      target: 'index.html',   // overwrite same file with critical CSS inlined
      inline: true,
      extract: true,
      width: 1300,
      height: 900,
    });
  } catch (err) {
    console.error('❌ Error generating critical CSS', err);
  }
}

buildCritical();
