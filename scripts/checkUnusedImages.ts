import * as fs from 'fs';
import * as path from 'path';

// Nutze den aktuellen Arbeitsordner des Projekts
const PROJECT_DIR = process.cwd();
const ASSETS_DIR = path.join(PROJECT_DIR, 'assets');
const MAPPING_FILE = path.join(PROJECT_DIR, 'src', 'utils', 'imageMappings.ts');

function findAllImages(dir: string, files: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findAllImages(fullPath, files);
    } else if (entry.isFile() && /\.(png|jpg|jpeg|gif)$/.test(entry.name)) {
      files.push(path.relative(PROJECT_DIR, fullPath));
    }
  }
  return files;
}

function findImageReferences(dir: string): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findImageReferences(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      files.push({ path: fullPath, content });
    }
  }
  return files;
}

function findUnusedImages(allImages: string[], referencedImages: string[]): string[] {
  return allImages.filter(image => !referencedImages.includes(image));
}

function checkForDuplicates(images: string[]): string[][] {
  const lowerCaseMap = new Map<string, string[]>();
  images.forEach(image => {
    const lower = image.toLowerCase();
    if (lowerCaseMap.has(lower)) {
      lowerCaseMap.get(lower)!.push(image);
    } else {
      lowerCaseMap.set(lower, [image]);
    }
  });
  return Array.from(lowerCaseMap.values()).filter(arr => arr.length > 1);
}

console.log('🔍 Suche nach ungenutzten Bildern...');
const allImages = findAllImages(ASSETS_DIR);
const tsFiles = findImageReferences(path.join(PROJECT_DIR, 'src'));

const referencedImages = new Set<string>();
tsFiles.forEach(({ content }) => {
  const matches = content.match(/require\(['"](.*?)['"]\)/g);
  if (matches) {
    matches.forEach(match => {
      const pathMatch = match.match(/['"](.*?)['"]/);
      if (pathMatch && pathMatch[1]) {
        const relativePath = pathMatch[1];
        // Normalisiere und löse den Pfad relativ zum Projektordner auf
        const absolutePath = path.normalize(path.resolve(PROJECT_DIR, relativePath));
        referencedImages.add(absolutePath);
      }
    });
  }
});

// Check imageMappings.ts separately
if (fs.existsSync(MAPPING_FILE)) {
  const mappingContent = fs.readFileSync(MAPPING_FILE, 'utf8');
  const matches = mappingContent.match(/require\(['"](.*?)['"]\)/g);
  if (matches) {
    matches.forEach(match => {
      const pathMatch = match.match(/['"](.*?)['"]/);
      if (pathMatch && pathMatch[1]) {
        const relativePath = pathMatch[1];
        // Normalisiere und löse den Pfad relativ zum Projektordner auf
        const absolutePath = path.normalize(path.resolve(PROJECT_DIR, relativePath));
        referencedImages.add(absolutePath);
      }
    });
  }
}

const unusedImages = findUnusedImages(allImages, Array.from(referencedImages));
const duplicateImages = checkForDuplicates(allImages);

if (unusedImages.length > 0) {
  console.warn('\n🚫 Ungenutzte Bilder gefunden:');
  unusedImages.forEach(image => console.log(`❌ ${image}`));
} else {
  console.log('✅ Keine ungenutzten Bilder gefunden.');
}

if (duplicateImages.length > 0) {
  console.warn('\n⚠️ Duplikate gefunden:');
  duplicateImages.forEach(group => console.log(`🔁 ${group.join(', ')}`));
} else {
  console.log('✅ Keine Duplikate gefunden.');
}
