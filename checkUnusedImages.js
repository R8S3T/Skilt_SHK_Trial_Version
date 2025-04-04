"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
// Nutze den aktuellen Arbeitsordner des Projekts
var PROJECT_DIR = process.cwd();
var ASSETS_DIR = path.join(PROJECT_DIR, 'assets');
var MAPPING_FILE = path.join(PROJECT_DIR, 'src', 'utils', 'imageMappings.ts');
function findAllImages(dir, files) {
    if (files === void 0) { files = []; }
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var entry = entries_1[_i];
        var fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            findAllImages(fullPath, files);
        }
        else if (entry.isFile() && /\.(png|jpg|jpeg|gif)$/.test(entry.name)) {
            files.push(path.normalize(fullPath)); // Normalisieren des Pfades
        }
    }
    return files;
}
function findImageReferences(dir) {
    var files = [];
    var entries = fs.readdirSync(dir, { withFileTypes: true });
    for (var _i = 0, entries_2 = entries; _i < entries_2.length; _i++) {
        var entry = entries_2[_i];
        var fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push.apply(files, findImageReferences(fullPath));
        }
        else if (entry.isFile() && entry.name.endsWith('.ts')) {
            var content = fs.readFileSync(fullPath, 'utf8');
            files.push({ path: fullPath, content: content });
        }
    }
    return files;
}
function findUnusedImages(allImages, referencedImages) {
    return allImages.filter(function (image) { return !referencedImages.includes(image); });
}
function checkForDuplicates(images) {
    var lowerCaseMap = new Map();
    images.forEach(function (image) {
        var lower = image.toLowerCase();
        if (lowerCaseMap.has(lower)) {
            lowerCaseMap.get(lower).push(image);
        }
        else {
            lowerCaseMap.set(lower, [image]);
        }
    });
    return Array.from(lowerCaseMap.values()).filter(function (arr) { return arr.length > 1; });
}
console.log('🔍 Suche nach ungenutzten Bildern...');
var allImages = findAllImages(ASSETS_DIR);
var tsFiles = findImageReferences(path.join(PROJECT_DIR, 'src'));
var referencedImages = new Set();
tsFiles.forEach(function (_a) {
    var content = _a.content;
    var matches = content.match(/require\(['"](.*?)['"]\)/g);
    if (matches) {
        matches.forEach(function (match) {
            var pathMatch = match.match(/['"](.*?)['"]/);
            if (pathMatch && pathMatch[1]) {
                var relativePath = pathMatch[1];
                // Normalisiere und löse den Pfad relativ zum Projektordner auf
                var absolutePath = path.normalize(path.resolve(PROJECT_DIR, relativePath));
                referencedImages.add(absolutePath);
            }
        });
    }
});
// Check imageMappings.ts separately
if (fs.existsSync(MAPPING_FILE)) {
    var mappingContent = fs.readFileSync(MAPPING_FILE, 'utf8');
    var matches = mappingContent.match(/require\(['"](.*?)['"]\)/g);
    if (matches) {
        matches.forEach(function (match) {
            var pathMatch = match.match(/['"](.*?)['"]/);
            if (pathMatch && pathMatch[1]) {
                var relativePath = pathMatch[1];
                // Normalisiere und löse den Pfad relativ zum Projektordner auf
                var absolutePath = path.normalize(path.resolve(PROJECT_DIR, relativePath));
                referencedImages.add(absolutePath);
            }
        });
    }
}
var unusedImages = findUnusedImages(allImages, Array.from(referencedImages));
var duplicateImages = checkForDuplicates(allImages);
if (unusedImages.length > 0) {
    console.warn('\n🚫 Ungenutzte Bilder gefunden:');
    unusedImages.forEach(function (image) { return console.log("\u274C ".concat(image)); });
}
else {
    console.log('✅ Keine ungenutzten Bilder gefunden.');
}
if (duplicateImages.length > 0) {
    console.warn('\n⚠️ Duplikate gefunden:');
    duplicateImages.forEach(function (group) { return console.log("\uD83D\uDD01 ".concat(group.join(', '))); });
}
else {
    console.log('✅ Keine Duplikate gefunden.');
}
