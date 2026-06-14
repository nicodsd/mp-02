import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const directories = [
    'contacto',
    'guias/caracteristicas-menu-digital',
    'guias/cuanto-sale-crear-un-menu-digital',
    'guias',
    'olvide-mi-contrasena',
    'pagos',
    'restablecer-contrasena'
];

const basePath = join(__dirname, 'app');

for (const dir of directories) {
    const pagePath = join(basePath, dir, 'page.tsx');
    if (existsSync(pagePath)) {
        let content = readFileSync(pagePath, 'utf8');
        
        // Match the injected metadata exactly
        const metadataRegex = /export const metadata = {\s*title: "([^"]+)",\s*description: "([^"]+)",\s*};\s*/;
        const match = content.match(metadataRegex);
        
        if (match) {
            const title = match[1];
            const description = match[2];
            
            // Remove from page.tsx
            content = content.replace(metadataRegex, '');
            writeFileSync(pagePath, content, 'utf8');
            console.log(`Removed metadata from ${pagePath}`);
            
            // Create layout.tsx
            const layoutPath = join(basePath, dir, 'layout.tsx');
            const layoutContent = `export const metadata = {
  title: "${title}",
  description: "${description}",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
`;
            writeFileSync(layoutPath, layoutContent, 'utf8');
            console.log(`Created ${layoutPath} with metadata`);
        } else {
            console.log(`Metadata not found in ${pagePath}`);
        }
    }
}
