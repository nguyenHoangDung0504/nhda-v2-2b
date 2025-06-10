import { readdir, stat, readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Chuyển đổi import.meta.url thành đường dẫn hệ thống
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hàm đếm số dòng trong một file
async function countLinesInFile(filePath) {
    const content = await readFile(filePath, 'utf8');
    return content.split('\n').length;
}

// Hàm quét qua tất cả các file trong thư mục
async function scanDirectory(dirPath, result) {
    const files = await readdir(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stats = await stat(fullPath);

        // Nếu là thư mục thì quét đệ quy
        if (stats.isDirectory()) {
            await scanDirectory(fullPath, result);
        } else if (stats.isFile() && !fullPath.endsWith('scan.mjs')) {
            if (fullPath.endsWith('.js')) {
                result.js += await countLinesInFile(fullPath);
            } else if (fullPath.endsWith('.css')) {
                result.css += await countLinesInFile(fullPath);
            } else if (fullPath.endsWith('.html')) {
                result.html += await countLinesInFile(fullPath);
            }
        }
    }
}

// Hàm chính
async function main() {
    const projectRoot = path.resolve(__dirname); // Đường dẫn gốc dự án
    const result = { js: 0, css: 0, html: 0 };

    await scanDirectory(projectRoot, result);

    console.log(`Số dòng JS: ${result.js}`);
    console.log(`Số dòng CSS: ${result.css}`);
    console.log(`Số dòng HTML: ${result.html}`);
    console.log(`Tổng: ${result.html + result.css + result.js}`);
}

main().catch(console.error);