# Node 16 Compatibility Plan

## Overview
This document outlines the changes needed to make the project compatible with Node.js 16.x for Ubuntu 18.04 deployment.

## Required Downgrades

### 1. Next.js
- **Current**: 16.0.10 (requires Node 18.17+)
- **Target**: 14.2.15 (last stable 14.x, supports Node 16.8+)
- **Impact**: Minimal - App Router is available in Next.js 14

### 2. React
- **Current**: 19.2.1 (requires Node 18+)
- **Target**: 18.3.1 (latest 18.x, supports Node 16+)
- **Impact**: Minimal - React 18 has all features we need

### 3. ESLint
- **Current**: 9.x (requires Node 18.18+)
- **Target**: 8.57.0 (last stable 8.x, supports Node 16+)
- **Impact**: Need to migrate from flat config to .eslintrc format

### 4. Playwright (Testing Only)
- **Current**: 1.57.0 (requires Node 18+)
- **Options**:
  - **Option A**: Keep current version, document that tests require Node 18+ (tests can run on CI/CD with Node 18+)
  - **Option B**: Downgrade to 1.40.0 (last version supporting Node 16)
- **Recommendation**: Option A - testing can use different Node version than production

### 5. TypeScript
- **Current**: 5.x
- **Status**: ✅ Compatible with Node 16 (no change needed)

### 6. Tailwind CSS
- **Current**: 4.x
- **Status**: ✅ Compatible with Node 16 (no change needed)

### 7. Other Dependencies
- **@types/node**: Change from ^20 to ^16
- **zustand**: ✅ Compatible (no change)
- **mediabunny**: ✅ Compatible (no change)
- **lucide-react**: ✅ Compatible (no change)

## Migration Steps

### Step 1: Update package.json
- Downgrade Next.js to 14.2.15
- Downgrade React to 18.3.1
- Downgrade React-DOM to 18.3.1
- Downgrade ESLint to 8.57.0
- Update @types/node to ^16
- Update @types/react to ^18
- Update @types/react-dom to ^18
- Update eslint-config-next to match Next.js 14

### Step 2: Migrate ESLint Config
- Convert from `eslint.config.mjs` (flat config) to `.eslintrc.json` (legacy config)
- Update ESLint config to use Next.js 14 compatible rules

### Step 3: Update TypeScript Config
- Verify tsconfig.json is compatible (should be fine)
- May need to adjust moduleResolution if needed

### Step 4: Test Compatibility
- Run `npm install` to verify all dependencies resolve
- Run `npm run build` to ensure build works
- Run `npm run dev` to verify dev server works
- Test conversion functionality

### Step 5: Update Documentation
- Update README.md to reflect Node 16 requirement
- Update architecture.md if needed

## Compatibility Matrix

| Dependency | Current | Node 16 Compatible | Notes |
|------------|---------|-------------------|-------|
| Next.js | 16.0.10 | 14.2.15 | App Router available |
| React | 19.2.1 | 18.3.1 | All features available |
| React-DOM | 19.2.1 | 18.3.1 | Matches React |
| ESLint | 9.x | 8.57.0 | Config format change |
| eslint-config-next | 16.0.10 | 14.2.15 | Match Next.js version |
| @types/node | ^20 | ^16 | Type definitions |
| @types/react | ^19 | ^18 | Type definitions |
| @types/react-dom | ^19 | ^18 | Type definitions |
| Playwright | 1.57.0 | 1.40.0 (optional) | Testing only |

## Testing Strategy

### Development (Node 16)
- ✅ Build process
- ✅ Dev server
- ✅ Runtime functionality
- ✅ Conversion features

### CI/CD (Node 18+)
- ✅ Run Playwright tests
- ✅ Full test suite
- ✅ Linting with ESLint 9 (if desired)

## Rollback Plan

If issues arise:
1. Keep package-lock.json in git for easy rollback
2. Document any breaking changes encountered
3. Consider using Node Version Manager (nvm) for local development

## Notes

- Next.js 14 still supports App Router (introduced in 13.4)
- React 18 has all features needed (concurrent features, Suspense, etc.)
- ESLint 8 is still maintained and receives security updates
- Production build will work identically on Node 16
