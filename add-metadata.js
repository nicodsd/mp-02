import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const directories = [
    'contacto',
    'ejemplo',
    'guias',
    'guias/caracteristicas-menu-digital',
    'guias/cuanto-sale-crear-un-menu-digital',
    'login',
    'mi-menu',
    'nuevo-plato',
    'olvide-mi-contrasena',
    'pagos',
    'panel-de-usuario',
    'politicas',
    'registro-de-usuario',
    'restablecer-contrasena',
    'terminos-y-condiciones'
];

const basePath = join(__dirname, 'app');

const metadataMap = {
    'contacto': { title: 'Contacto | QMenú', description: 'Comunícate con nosotros para cualquier consulta sobre QMenú.' },
    'ejemplo': { title: 'Ejemplo de Menú Digital | QMenú', description: 'Mira un ejemplo de cómo se verá tu menú digital con QMenú.' },
    'guias': { title: 'Guías y Recursos | QMenú', description: 'Aprende a sacarle el máximo provecho a tu menú digital con nuestras guías.' },
    'guias/caracteristicas-menu-digital': { title: 'Características del Menú Digital | QMenú', description: 'Descubre todas las características y beneficios que QMenú ofrece para tu restaurante.' },
    'guias/cuanto-sale-crear-un-menu-digital': { title: '¿Cuánto cuesta crear un menú digital? | QMenú', description: 'Conoce los precios y planes para crear un menú digital QR.' },
    'login': { title: 'Iniciar Sesión | QMenú', description: 'Inicia sesión en tu cuenta de QMenú para gestionar tus restaurantes y menús.' },
    'mi-menu': { title: 'Mi Menú | QMenú', description: 'Gestiona los platos y categorías de tu menú digital de forma sencilla.' },
    'nuevo-plato': { title: 'Nuevo Plato | QMenú', description: 'Añade un nuevo plato a tu menú digital rápidamente.' },
    'olvide-mi-contrasena': { title: 'Olvidé mi contraseña | QMenú', description: 'Recupera el acceso a tu cuenta de QMenú.' },
    'pagos': { title: 'Pagos | QMenú', description: 'Gestiona los pagos de tu suscripción a QMenú.' },
    'panel-de-usuario': { title: 'Panel de Usuario | QMenú', description: 'Administra tu cuenta y tus menús digitales desde el panel de control.' },
    'politicas': { title: 'Políticas de Privacidad | QMenú', description: 'Lee nuestras políticas de privacidad y cómo protegemos tus datos.' },
    'registro-de-usuario': { title: 'Registro de Usuario | QMenú', description: 'Crea tu cuenta en QMenú y empieza a digitalizar tu restaurante gratis.' },
    'restablecer-contrasena': { title: 'Restablecer Contraseña | QMenú', description: 'Cambia tu contraseña para mantener tu cuenta segura.' },
    'terminos-y-condiciones': { title: 'Términos y Condiciones | QMenú', description: 'Revisa los términos y condiciones de uso de la plataforma QMenú.' }
};

for (const dir of directories) {
    const pagePath = join(basePath, dir, 'page.tsx');
    if (existsSync(pagePath)) {
        let content = readFileSync(pagePath, 'utf8');
        if (!content.includes('export const metadata')) {
            const meta = metadataMap[dir];
            const metaString = `\nexport const metadata = {\n  title: "${meta.title}",\n  description: "${meta.description}",\n};\n\n`;

            // Inject right before "export default"
            const exportIndex = content.indexOf('export default');
            if (exportIndex !== -1) {
                content = content.slice(0, exportIndex) + metaString + content.slice(exportIndex);
                writeFileSync(pagePath, content, 'utf8');
                console.log(`Updated ${pagePath}`);
            } else {
                console.log(`Could not find "export default" in ${pagePath}`);
            }
        } else {
            console.log(`Metadata already exists in ${pagePath}`);
        }
    } else {
        console.log(`File not found: ${pagePath}`);
    }
}
