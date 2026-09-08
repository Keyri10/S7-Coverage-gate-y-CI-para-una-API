# S7-Coverage-CI-Reservaciones

Aplicación pequeña de reservaciones de salas. La lógica de negocio vive en `domain.ts`, el servicio orquesta casos de uso y el repositorio guarda todo en memoria.

## Stack

- TypeScript
- Vitest + `@vitest/coverage-v8` (umbral 80%)
- pnpm

## Setup

```bash
pnpm install
```

## Tests

Los tests siguen el patrón **Given / When / Then**.

```bash
pnpm test:unit
pnpm test:integration
pnpm test:coverage
```

El reporte HTML queda en `coverage/index.html`.
