# Power Plant Critical Spare Parts

A presentation-ready, clickable decision-support prototype for evaluating critical spare-part requirements across technical validation, inventory, maintenance, procurement, supplier qualification, data conflicts, and operational risk.

The prototype uses mocked data only. It does not connect to CMMS, ERP, OEM, inventory, supplier, authentication, or procurement systems.

## Local development

Requirements:

- Node.js 20.9 or newer
- Corepack/pnpm

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`.

## Production verification

```bash
pnpm build
pnpm start
```

## Deploy on Vercel

1. Import this GitHub repository into Vercel.
2. Keep the detected framework as **Next.js**.
3. Keep the default install and build commands.
4. Deploy.

No environment variables or external services are required for this prototype.
