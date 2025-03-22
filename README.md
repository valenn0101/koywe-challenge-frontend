# Next.js TypeScript Template

Este es un template de proyecto que utiliza las siguientes tecnologías:

- [Next.js](https://nextjs.org/) con estructura App Router
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/) para linting
- [Prettier](https://prettier.io/) para formateo de código
- [Tanstack Query](https://tanstack.com/query) para manejo de estado del servidor
- [Axios](https://axios-http.com/) para peticiones HTTP
- [Jest](https://jestjs.io/) y [Testing Library](https://testing-library.com/) para pruebas

## Cómo usar este template

### Opción 1: Usar GitHub Template

1. Haz clic en el botón "Use this template" en la parte superior del repositorio
2. Selecciona "Create a new repository"
3. Elige un nombre para tu repositorio y completa la creación
4. Clona tu nuevo repositorio
5. Instala las dependencias con `npm install`

### Opción 2: Clonar manualmente

1. Clona este repositorio
2. Elimina la carpeta `.git` y inicializa un nuevo repositorio: `rm -rf .git && git init`
3. Instala las dependencias con `npm install`
4. Actualiza el nombre y versión en `package.json`

## Comenzando

Primero, instala las dependencias:

```bash
npm install
```

Luego, inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo con Turbopack
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia la aplicación construida
- `npm run lint` - Ejecuta ESLint para verificar errores
- `npm run format` - Formatea el código con Prettier
- `npm run test` - Ejecuta las pruebas con Jest
- `npm run test:watch` - Ejecuta las pruebas en modo observador

## Estructura del proyecto

```
/
├── public/                 # Archivos estáticos
├── src/
│   ├── app/                # Rutas de la aplicación (App Router)
│   ├── components/         # Componentes reutilizables
│   │   └── __tests__/      # Pruebas de componentes
│   ├── hooks/              # Custom hooks
│   └── lib/                # Utilidades y configuraciones
│       └── providers/      # Proveedores de contexto
├── jest.config.mjs         # Configuración de Jest
├── jest.setup.js           # Configuración para pruebas
├── next.config.ts          # Configuración de Next.js
└── tsconfig.json           # Configuración de TypeScript
``` 