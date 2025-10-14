## Tech Stack | 기술 스택 | Pile technologique

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 4, `tailwind-merge`, `clsx`, `class-variance-authority`
- Radix UI (`@radix-ui/*`), custom UI components, `lucide-react`
- Forms: `react-hook-form`, `@hookform/resolvers`, `zod`
- UI/UX: `next-themes`, `sonner` (toasts), `react-day-picker`
- Carousel: `embla-carousel-react`, `embla-carousel-autoplay`
- Data/Utils: `date-fns`, `numeral`, `react-markdown`
- Firebase (Client SDK) for auth/db/storage
- Firebase Admin SDK on server for secure operations

## Features | 주요 기능 | Fonctionnalités

- Auth: Email/Password + Google Login, Register, Forgot Password
- Account: Profile update, password update, favourites, orders
- Catalogue: Properties/products list, detail pages, search/filter
- Cart & Checkout
- Reviews with ratings
- Admin Dashboard: Banners, Coupons, Properties CRUD, uploads

## Requirements | 사전 준비 | Prérequis

- Node.js 18+
- Firebase project (Web app + service account)

## Environment Variables | 환경 변수 | Variables d’environnement

Create a `.env.local` file in the project root.

Client SDK (public):
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Admin SDK (server):
```bash
FIREBASE_PRIVATE_KEY_ID=...
FIREBASES_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
```

Note: The private key must preserve line breaks (escaped as `\n`).

## Development | 개발 | Développement

Install dependencies and start the dev server:
```bash
npm install
npm run dev
# or: yarn dev / pnpm dev / bun dev
```

Open `http://localhost:3000`.

## Build & Start | 빌드 & 시작 | Construire & démarrer
```bash
npm run build
npm start
```

## Configuration Notes | 구성 메모 | Notes de configuration

- Images: remote patterns configured for `lh3.googleusercontent.com` and `firebasestorage.googleapis.com` in `next.config.ts`.
- Dark mode: `next-themes` with `class` strategy; Tailwind `darkMode: 'class'`.
- Admin SDK is initialized once on server; ensure env vars are set in deployment.

## Scripts | 스크립트 | Scripts

- `npm run dev`: start development server
- `npm run build`: production build
- `npm start`: start production server
- `npm run lint`: run ESLint

## Directory Overview | 디렉터리 개요 | Aperçu des dossiers

- `app/`: App Router pages (auth, account, admin-dashboard, checkout, etc.)
- `components/`: UI components (navbar, forms, banners, carousel, etc.)
- `firebase/`: `client.ts` (Client SDK), `server.ts` (Admin SDK)
- `lib/`, `context/`, `types/`, `validation/`: utilities, state, schemas, types

## Deployment | 배포 | Déploiement

- This project was deployed using Vercel. Make sure to add the above environment variables.
- Ensure Firebase Admin credentials are set as secure environment variables.


## Prisma Integration for Payment System

This project uses **Prisma** as a type-safe ORM to handle payment-related data while continuing to use **Firebase** for authentication and product data. Here's a summary of the setup and work done:

### Prisma Setup

1. Installed Prisma dependencies:
   ```bash
   npm install prisma --save-dev
   npm install @prisma/client

2.	Initialized Prisma in the project:
    ```bash
    npx prisma init

3.	Configured the Prisma client with optional performance extensions: 
    lib/prisma.ts

4.	Defined the database schema (schema.prisma) to manage users, orders, and payments:
    prisma/schema.prisma 

5. data migration excution 
    ```bash
    npx prisma migrate dev --name init
6. test connection 
    ```bash 
    npx prisma studio
    go to http://localhost:5555 

if you can see the data table, it success!!

## Payment by Stripe

1. Stripe install 
    ```bash 
    npm install stripe  
    npm install @stripe/react-stripe-js @stripe/stripe-js

- stripe는 서버에서 결제 요청을 보내기 위해 필요
- 프론트에서는 @stripe/react-stripe-js + @stripe/stripe-js를 사용해서 카드 정보 입력 UI를 만들수 있음

2. Stripe Key Setup
    -Go to the Stripe Dashboard and obtain your Test Secret Key and Publishable Key.
    -Add them to your .env file:
    ```
    STRIPE_SECRET_KEY=your_test_secret_key
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
    ```
4.prisma/schema.prisma에 타입 추가후  데이터 추가 명령어 
```bash
npx prisma db push
````

## Create Serve endpoint 
app/api/payment/route.ts
## Create payment button 
app/checkout/page.tsx

## 결제 페이지에 대한 문제들 요약
# Payment Implementation - Troubleshooting Guide

## 🎯 Overview
Stripe 결제 시스템을 Next.js 15 + Prisma + Firebase Auth 환경에서 구현하면서 발생한 문제들과 해결 과정.

---

## 🔴 발생했던 주요 문제들

### 1. Prisma Client 초기화 오류
```
Error: @prisma/client did not initialize yet. Please run "prisma generate"
```

**원인:**
- Next.js 15의 webpack 번들링 시스템과 Prisma의 호환성 문제
- `lib/prisma.ts`를 통한 간접 import 시 모듈이 제대로 로드되지 않음

**해결:**
- API 라우트에서 PrismaClient를 직접 import
- `serverExternalPackages` 설정 추가

### 2. Prisma Schema 필드 누락
```
Error: Unknown field 'stripeSessionId' in Payment model
```

**원인:**
- Payment 모델에 Stripe 관련 필드가 정의되지 않음

**해결:**
- Schema에 필수 필드 추가 및 데이터베이스 컬럼명 매핑

### 3. DATABASE_URL 환경변수 누락
```
Error: Environment variable not found: DATABASE_URL
```

**원인:**
- `.env` 파일이 없거나 Prisma가 환경변수를 읽지 못함

**해결:**
- 프로젝트 루트에 `.env` 파일 생성 및 DATABASE_URL 설정

### 4. User Not Found (404)
```
POST /api/payment 404
```

**원인:**
- 데이터베이스에 Firebase UID와 매칭되는 User가 없음

**해결:**
- User를 찾거나 없으면 자동으로 생성하는 로직 추가

---

## ✅ 최종 구현 코드

### 1. Prisma Schema 수정
```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  // ⚠️ output 경로를 커스텀하지 않고 기본값 사용
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id          String   @id @default(cuid())
  firebaseUID String   @unique @map("firebase_uid")
  email       String   @unique
  name        String?
  orders      Order[]
  createdAt   DateTime @default(now()) @map("created_at")
  
  @@map("users")
}

model Order {
  id          String   @id @default(cuid())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String   @map("user_id")
  totalAmount Float    @map("total_amount")
  status      String   @default("pending")
  createdAt   DateTime @default(now()) @map("created_at")
  payment     Payment?
  
  @@map("orders")
}

model Payment {
  id              String   @id @default(cuid())
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  orderId         String   @unique @map("order_id")
  provider        String 
  amount          Float
  status          String   @default("unpaid")
  stripeSessionId String?  @map("stripe_session_id")  // ✅ 추가
  couponCode      String?  @map("coupon_code")        // ✅ 추가
  pointsUsed      Float    @default(0) @map("points_used") // ✅ 추가
  createdAt       DateTime @default(now()) @map("created_at")
  
  @@map("payments")
}
```

### 2. Next.js Config 수정
```typescript
// next.config.ts

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com"
      }
    ]
  },
  // ✅ Next.js 15에서는 experimental이 아닌 최상위 레벨로 이동
  serverExternalPackages: ['@prisma/client', 'prisma'],
  async headers() {
    return [
      {
        source: '/(admin-dashboard|account|checkout)/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
```

### 3. API Route 구현
```typescript
// app/api/payment/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client'; // ✅ 직접 import
import { auth } from "@/firebase/server";

export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

// ✅ API 라우트 내에서 직접 인스턴스 생성
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: NextRequest) {
    const requestHeaders = new Headers(req.headers);
    const origin = requestHeaders.get('origin') || process.env.NEXT_PUBLIC_BASE_URL;
    
    try {
        const { firebaseToken, cartItems, couponCode, discount, pointsUsed } = await req.json();
        
        // Firebase 인증
        const decodedToken = await auth.verifyIdToken(firebaseToken);
        const firebaseUID = decodedToken.uid;
        
        // ✅ User 찾기 또는 생성
        let user = await prisma.user.findUnique({
            where: { firebaseUID }
        });
        
        if (!user) {
            user = await prisma.user.create({
                data: {
                    firebaseUID: firebaseUID,
                    email: decodedToken.email || `${firebaseUID}@example.com`,
                    name: decodedToken.name || null,
                }
            });
        }

        // 금액 계산
        const totalSubtotal = cartItems.reduce(
            (sum: number, item: any) => sum + Number(item.price || 0) * Number(item.quantity || 1),
            0
        );
        const totalDiscountAmount = (discount || 0) + (pointsUsed || 0);
        const finalAmount = Math.max(totalSubtotal - totalDiscountAmount, 0);
        
        // Stripe Line Items 구성
        const lineItems: any[] = cartItems.map((item: any) => ({
            price_data: {
                currency: 'eur',
                product_data: { name: item.name },
                unit_amount: Math.round(Number(item.price) * 100),
            },
            quantity: Number(item.quantity) || 1,
        }));
        
        if (totalDiscountAmount > 0) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: { name: 'Coupon/Points Discount' },
                    unit_amount: Math.round(-totalDiscountAmount * 100),
                },
                quantity: 1,
            });
        }
        
        // Stripe 세션 생성
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment/cancel`
        });
        
        // Order 생성
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                totalAmount: finalAmount,
                status: 'pending',
                payment: {
                    create: {
                        provider: 'stripe',
                        amount: finalAmount,
                        status: 'unpaid',
                        stripeSessionId: session.id,
                        couponCode: couponCode || null,
                        pointsUsed: pointsUsed || 0,
                    },
                },
            },
        });

        return NextResponse.json({
            url: session.url,
            orderId: order.id
        });
    } catch (error: any) {
        console.error("💥 Payment Error:", error);
        return NextResponse.json(
            { message: error.message || "결제 세션 생성 중 오류 발생" },
            { status: 500 }
        );
    }
}
```

### 4. 환경 변수 설정
```bash
# .env

DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 5. package.json 스크립트
```json
{
  "scripts": {
    "dev": "prisma generate && next dev",
    "build": "prisma generate && next build",
    "postinstall": "prisma generate"
  }
}
```

---

## 🔧 필수 실행 명령어

### 초기 설정
```bash
# 1. 의존성 설치
npm install

# 2. Prisma Client 생성
npx prisma generate

# 3. 데이터베이스 마이그레이션
npx prisma db push

# 4. 개발 서버 시작
npm run dev
```

### 문제 발생 시 (캐시 클리어)
```bash
# 모든 캐시 삭제
rm -rf .next
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# 재설치 및 재생성
npm install
npx prisma generate
npm run dev
```

### Prisma Studio로 데이터 확인
```bash
npx prisma studio
```

---

## 📚 주요 학습 포인트

### 1. Next.js 15 변경사항
- `experimental.serverComponentsExternalPackages` → `serverExternalPackages`
- webpack 번들링 방식 변경으로 Prisma import 방식 조정 필요

### 2. Prisma 모범 사례
- Schema에서 `@map()` 사용으로 TypeScript 네이밍과 DB 컬럼명 분리
- API 라우트마다 새로운 인스턴스를 생성하는 것보다 글로벌 인스턴스 재사용 권장 (프로덕션에서)
- Connection pooling 설정으로 DB 연결 최적화

### 3. Stripe 통합 팁
- 금액은 항상 센트 단위로 변환 (`Math.round(amount * 100)`)
- 할인은 마이너스 line item으로 처리
- Webhook을 통한 결제 확인 구현 필수

---

## ⚠️ 주의사항

1. **환경변수 보안**
   - `.env` 파일은 절대 Git에 커밋하지 말 것
   - `.gitignore`에 `.env*` 추가 확인

2. **Prisma Generate**
   - 스키마 수정 후 반드시 `npx prisma generate` 실행
   - 배포 시 `postinstall` 스크립트로 자동화

3. **에러 처리**
   - 모든 API 호출에 try-catch 구현
   - 사용자에게 명확한 에러 메시지 제공

4. **테스트**
   - Stripe Test Mode 키 사용
   - 테스트 카드: `4242 4242 4242 4242`

---

## 🎯 다음 구현 예정

- [ ] Stripe Webhook 구현 (결제 확인)
- [ ] 결제 성공/실패 페이지 개선
- [ ] 주문 내역 조회 기능
- [ ] 이메일 알림 (결제 완료 시)
- [ ] 환불 처리 로직

---

## 🔗 참고 자료

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Firebase Auth with Next.js](https://firebase.google.com/docs/auth/web/start)

##A summary of issues related to the payment page
Issue 1: Non-JSON response from /api/payment
Problem: The /api/payment API Route failed to return a JSON object, instead sending an HTML error page to the client.

Cause: The STRIPE_SECRET_KEY was located in the .env file but was not being correctly loaded by Next.js due to an incorrect file name or a syntax error (e.g., spaces around the equal sign). This caused the server to crash on startup, returning the default HTML error page.

Solution:

We moved the sensitive environment variables to the .env.local file and removed unnecessary spaces from the variable assignment, which fixed the loading issue.

We completely restarted the server using npm run dev to ensure the new environment variables were correctly loaded.

Issue 2: Prisma Client Initialization Error
Problem: The error @prisma/client did not initialize yet occurred.

Cause: The lib/prisma.ts file had a syntax error in its Prisma Client singleton pattern. Additionally, the npx prisma generate command was not correctly reflected in the build process, and Next.js was not configured to handle Prisma as an external module, leading to a build conflict.

Solution:

We corrected the syntax error in the lib/prisma.ts file and ran npx prisma generate to regenerate the Prisma Client files.

We added the serverExternalPackages configuration to next.config.js to prevent Next.js from bundling the Prisma Client, allowing it to be correctly loaded from the Node.js runtime.

Issue 3: Database Migration Error
Problem: We encountered a P2022 error: The column stripe_session_id does not exist in the current database.

Cause: While the schema.prisma file was updated to include the new stripeSessionId field, the corresponding change was not applied to the actual PostgreSQL database table.

Solution:

We ran the command npx prisma migrate dev --name add_stripe_session_id to create and apply a new migration file, which added the required column to the database.

We restarted the server with npm run dev to ensure the new database schema was synchronized with the application code.


## Payment - test card number : https://docs.stripe.com/testing?locale=fr-FR

## 결제 확인 단계 Payment Verification
app/api/payment/verify/route.ts 
app/payment/success/page.ts 결제 성공 페이지를 만든다 

사용자가 Stripe 결제를 완료하면, Stripe는 `success_url`로 지정된 `/payment/success` 페이지로 사용자를 리디렉션합니다. 이 페이지는 URL에 포함된 `session_id`를 사용하여 서버의 `/api/payment/verify` 엔드포인트로 결제 확인 요청을 보냅니다.
Once the user completes the Stripe payment, Stripe redirects them to the /payment/success page specified in the success_url. This page then uses the session_id contained in the URL to send a payment verification request to the /api/payment/verify endpoint on the server.

**`/api/payment/verify` API의 주요 역할:**
**Key Roles of the /api/payment/verify API:**

* **Stripe 세션 유효성 검사**: 전달받은 `session_id`를 사용하여 Stripe API에 결제 상태를 직접 확인합니다.
* **결제 상태 업데이트**: Stripe에서 `payment_status`가 'paid'로 확인되면, 데이터베이스의 `Payment` 레코드를 'paid'로 업데이트합니다.
* **주문 상태 업데이트**: 동시에 관련 `Order` 레코드의 상태를 'pending'에서 'completed'로 변경합니다. 이 두 작업은 **Prisma 트랜잭션**으로 묶여 있어 데이터 불일치가 발생하지 않도록 합니다.
* **응답**: 결제 확인 결과를 JSON 형식으로 반환하여 클라이언트(프런트엔드)에 성공 여부를 알려줍니다.

* Stripe Session Validation: Uses the received session_id to directly check the payment status with the Stripe API.

* Payment Status Update: If Stripe confirms the payment_status as 'paid', the Payment record in the database is updated to 'paid'.

* Order Status Update: Simultaneously, the status of the related Order record is changed from 'pending' to 'completed'. These two operations are bundled using Prisma transactions to ensure atomicity and prevent data inconsistency.

* Response: Returns the payment verification result in JSON format to notify the client (frontend) of the success status.

### 데이터베이스 스키마 (`prisma/schema.prisma`) 
### Database Schema (`prisma/schema.prisma`) 

* **`Order`**: 사용자의 주문 정보를 저장합니다. `status` 필드는 'pending'과 'completed' 상태를 추적합니다.
* **`Payment`**: 각 주문에 대한 결제 정보를 담고 있습니다. `stripeSessionId` 필드는 Stripe 세션 ID와 `Order`를 1:1로 연결하는 데 사용되는 **고유 키**입니다.

* Order: Stores user order information. The status field tracks 'pending' and 'completed' states.

* Payment: Contains payment information for each order. The stripeSessionId field is a unique key used to link the Stripe session ID 1:1 with the Order.

## 결제 완료 후 장바구니 처리 (Post-Payment Cart Clearing)

결제가 성공적으로 완료되면 사용자의 장바구니를 자동으로 비워주는 기능입니다. 이 프로세스는 클라이언트와 서버 간의 비동기 통신과 상태 관리를 통해 데이터의 정합성을 보장하며, 여러 단계의 디버깅을 통해 안정화되었습니다.
This feature automatically clears a user's shopping cart after a payment is successfully completed. The process ensures data consistency through asynchronous communication and state management between the client and server, and it has been stabilized through multiple debugging stages.



# 핵심 수정 및 추가 사항 Core Modifications and Additions

(File: app/api/cart/route.ts)
서버 API 로직 수정: 기존에는 장바구니를 Firestore의 서브컬렉션으로 잘못 간주하여 삭제를 시도했으나, 실제 데이터 구조인 사용자 문서 내의 배열 필드(cart: [])를 직접 업데이트하도록 수정했습니다. 이것이 기능이 동작하지 않았던 근본적인 원인이었습니다.
Server API Logic Correction: The API previously attempted to delete the cart by incorrectly treating it as a Firestore subcollection. This was corrected to update the actual data structure, which is an array field (cart: []) within the user document. This was the root cause of the feature's malfunction.

(File: @/context/CartContext.tsx)
클라이언트 상태 갱신 메커니즘 추가: 서버에서 데이터가 삭제된 후, 클라이언트 UI가 변경 사항을 인지하고 화면을 다시 렌더링할 수 있도록 CartContext에 refreshCart 함수를 추가했습니다.
Client-Side State Refresh Mechanism: After data is deleted on the server, the refreshCart function was added to the CartContext to enable the client UI to recognize the change and re-render.

(File: app/payment/success/page.tsx)
인증 토큰 처리 강화: 클라이언트에서 서버로 API 요청 시, 만료되지 않은 최신 ID 토큰을 보내도록 getIdToken(true)를 사용하여 토큰 새로고침을 강제했습니다.
Enhanced Authentication Token Handling: To ensure a non-expired, up-to-date ID token is sent with API requests from the client, token refreshing was enforced using getIdToken(true).

1. 결제 성공 및 확인 (/payment/success 페이지)
Payment Success and Verification (/payment/success page)
(File: app/payment/success/page.tsx)

진입: 사용자가 Stripe 결제를 마치면 success_url에 지정된 /payment/success 페이지로 리디렉션됩니다. 이때 URL 쿼리 파라미터로 session_id가 함께 전달됩니다.
Entry: When a user completes a Stripe payment, they are redirected to the /payment/success page as specified in the success_url. The session_id is passed along as a URL query parameter.

로직 실행 조건: 페이지의 useEffect 훅은 sessionId와 useAuth()를 통해 가져온 currentUser 객체가 모두 유효할 때 실행됩니다. 이를 통해 비동기적인 사용자 인증 정보 로딩을 안전하게 기다립니다.
Logic Execution Condition: The page's useEffect hook executes only when both the sessionId and the currentUser object (fetched via useAuth()) are valid. This ensures it safely waits for asynchronous user authentication information to load.

결제 검증: fetch를 사용해 /api/payment/verify 엔드포인트로 session_id를 보내 결제를 최종 확인합니다.
Payment Verification: It sends the session_id to the /api/payment/verify endpoint using fetch to finalize payment confirmation.

2. 장바구니 비우기 요청 (클라이언트)
Request to Clear Cart (Client-Side)
(File: app/payment/success/page.tsx)

토큰 준비: 결제 검증이 성공하면, currentUser.getIdToken(true)를 호출하여 만료되지 않은 최신 Firebase ID 토큰을 가져옵니다. true 플래그는 토큰을 강제로 새로고침하여 인증 오류를 방지합니다.
Token Preparation: Once payment verification succeeds, it calls currentUser.getIdToken(true) to fetch the latest non-expired Firebase ID token. The true flag forces the token to be refreshed, preventing authentication errors.

API 호출: fetch를 사용하여 DELETE 메서드로 /api/cart 엔드포인트에 요청을 보냅니다. Authorization: 'Bearer ' + idToken 형식으로 HTTP 헤더에 인증 토큰을 포함시킵니다.
API Call: It sends a request to the /api/cart endpoint using the DELETE method via fetch. The authentication token is included in the HTTP headers in the format Authorization: 'Bearer ' + idToken.

3. 장바구니 데이터 삭제 (서버 API)
Deleting Cart Data (Server API)
(File: app/api/cart/route.ts)

인증: /api/cart API는 요청 헤더에서 Bearer 토큰을 추출하고, Firebase Admin SDK의 auth.verifyIdToken()을 사용해 토큰의 유효성을 검증하고 사용자(uid)를 식별합니다.
Authentication: The /api/cart API extracts the Bearer token from the request headers and verifies its validity using the Firebase Admin SDK's auth.verifyIdToken() to securely identify the user (uid)

데이터 수정: Firestore에서 users/{uid} 경로의 사용자 문서를 참조합니다.
Data Modification: It references the user document at the path users/{uid} in Firestore.

핵심 로직: userRef.update({ cart: [] })를 실행하여 해당 문서의 cart 필드를 빈 배열로 덮어씁니다. 이전에 시도했던 서브컬렉션 삭제 로직 대신, 실제 데이터 구조에 맞는 필드 업데이트를 수행합니다.
Core Logic: It executes userRef.update({ cart: [] }) to overwrite the cart field in that document with an empty array. This performs a field update that matches the actual data structure, instead of the previous attempt to delete a subcollection.

응답: 작업이 성공하면 200 OK 상태와 성공 메시지를 담은 JSON을 클라이언트에 반환합니다.
Response: Upon success, it returns a JSON object with a success message and a 200 OK status to the client.

4. 클라이언트 UI 갱신 (React Context)
Client-Side UI Update (React Context)
 (File: @/context/CartContext.tsx)

갱신 신호 전송: 클라이언트는 API로부터 성공 응답을 받으면, useCart() 훅에서 가져온 refreshCart() 함수를 호출합니다.
Sending a Refresh Signal: When the client receives a success response from the API, it calls the refreshCart() function obtained from the useCart() hook.

상태 변경: refreshCart() 함수는 CartContext 내부의 refreshTrigger라는 useState 상태를 변경시킵니다.
State Change: The refreshCart() function updates a useState variable called refreshTrigger inside the CartContext.

데이터 리페칭(Re-fetching): CartContext의 useEffect 훅은 refreshTrigger 상태를 의존성 배열에 포함하고 있습니다. 따라서 refreshTrigger가 변경되면 useEffect가 다시 실행되어, Firestore로부터 최신 장바구니 데이터(이제 비어있는 배열)를 다시 불러옵니다.
Data Re-fetching: The useEffect hook in CartContext includes refreshTrigger in its dependency array. Therefore, when refreshTrigger changes, the useEffect hook re-runs, fetching the latest cart data (which is now an empty array) from Firestore.

UI 리렌더링: setCartItems([])가 호출되면서 Context가 관리하는 cartItems 상태가 업데이트되고, 이 상태를 구독하는 모든 UI 컴포넌트(예: 장바구니 아이콘, 사이드 모달)가 자동으로 리렌더링되어 빈 장바구니 상태를 화면에 즉시 반영합니다.
UI Rerendering: As setCartItems([]) is called, the cartItems state managed by the Context is updated. All UI components subscribing to this state (e.g., the cart icon, side modal) automatically re-render, immediately reflecting the empty cart status on the screen.
