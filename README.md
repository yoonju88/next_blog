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



## 오더 리스트 처리 작업 과정

1.백엔드 API 엔드포인트 생성 (/api/orders)
Prisma를 사용해 현재 로그인된 유저의 주문 내역을 DB에서 조회합니다.
조회된 주문 내역에 포함된 상품 ID들을 이용해 Firestore에서 해당 상품들의 상세 정보(이름, 이미지 등)를 가져옵니다.
두 데이터를 조합하여 프론트엔드에 최종 데이터를 전송합니다.

# Order List Processing Workflow
	1.	Create a backend API endpoint (/api/orders)
Using Prisma, fetch the logged-in user’s order history from the database.
Using the product IDs included in the retrieved orders, fetch detailed product information (name, images, etc.) from Firestore.
Combine the two datasets and send the final data to the frontend.

⸻

	2.	프론트엔드 페이지 생성 (account/orders)
Next.js 페이지 컴포넌트를 만듭니다.
페이지가 로드될 때 위에서 만든 /api/orders API를 호출하여 주문 데이터를 받아옵니다.
받아온 데이터를 기반으로 UI를 렌더링하고, 로딩 및 에러 상태를 처리합니다.
	3.	Create a Frontend Page (account/orders)
Create a Next.js page component.
When the page loads, call the /api/orders API created above to fetch order data.
Render the UI based on the received data and handle loading and error states.

⸻

# 사용자 주문 목록 페이지

이 문서는 사용자가 자신의 주문 내역을 확인할 수 있는 페이지를 구현하는 전체 과정을 설명합니다. 이 기능은 Next.js 서버 컴포넌트, 서버 액션, 그리고 보안 강화를 위한 서버 세션 쿠키를 사용하여 구현되었습니다.

User Order History Page

This document explains the entire process of implementing a page where users can view their order history. The feature is implemented using Next.js server components, server actions, and secure server-managed session cookies.

⸻

# 구현 순서 및 파일 설명

Implementation Steps and File Descriptions

⸻

1단계: 데이터베이스 스키마 확장
가장 먼저, 주문에 어떤 상품들이 포함되었는지 저장하기 위해 데이터베이스 구조를 확장했습니다.

Step 1: Extend Database Schema
First, extend the database structure to store which products are included in an order.

⸻

파일: prisma/schema.prisma
내용:
OrderItem 모델을 새로 생성하여 주문된 개별 상품(상품 ID, 이름, 가격, 수량)을 저장
기존 Order 모델에 items OrderItem[] 필드를 추가하여, 하나의 주문이 여러 개의 상품을 가질 수 있도록 1:N 관계를 설정했습니다.
npx prisma migrate dev 명령어로 데이터베이스에 변경사항을 적용

File: prisma/schema.prisma
Content:
Create a new OrderItem model to store individual products in an order (product ID, name, price, quantity).
Add an items OrderItem[] field to the existing Order model, establishing a 1:N relationship so that a single order can have multiple products.
Apply the database changes using the command npx prisma migrate dev.

⸻

2단계: 주문 생성 시 상품 목록 저장
결제 시 생성되는 주문 데이터에 상품 목록이 포함되도록 API 로직을 수정했습니다.

Step 2: Save Product List When Creating Orders
Modify the API logic to include the product list in the order data created during checkout.

⸻

파일: app/api/payment/route.ts
내용:
prisma.order.create 함수 내부에 Prisma의 “중첩 쓰기(nested write)” 기능인 items: { create: … } 로직을 추가했습니다.
이를 통해 Order가 생성될 때, 클라이언트로부터 받은 cartItems 배열을 바탕으로 OrderItem 레코드들이 동시에 생성되어 데이터베이스에 저장됩니다.

File: app/api/payment/route.ts
Content:
Add the Prisma nested write logic items: { create: ... } inside prisma.order.create.
This ensures that when an Order is created, OrderItem records are simultaneously created in the database based on the cartItems array received from the client.

⸻

3단계: 인증 방식 개선 (서버 세션 쿠키 도입)
서버 액션에서 사용자를 안전하게 인증하기 위해, 기존의 단기 ID 토큰 방식에서 서버가 직접 관리하는 장기 세션 쿠키 방식으로 전환했습니다.

Step 3: Improve Authentication (Introduce Server Session Cookies)
To securely authenticate users in server actions, switch from the short-lived ID token method to a server-managed long-term session cookie method.

⸻

생성된 파일: lib/auth/actions.ts
내용:
setAuthCookie: 클라이언트의 ID 토큰을 받아, 서버만 접근할 수 있는 안전한 httpOnly 세션 쿠키를 생성하는 서버 액션입니다.
clearAuthCookie: 로그아웃 시 서버에 생성된 모든 인증 관련 쿠키를 삭제하는 서버 액션입니다.

Created File: lib/auth/actions.ts
Content:
setAuthCookie: A server action that receives the client’s ID token and creates a secure httpOnly session cookie accessible only by the server.
clearAuthCookie: A server action that deletes all authentication-related cookies on logout.

⸻

수정된 파일: @/context/auth.tsx
내용:
AuthProvider의 useEffect 훅을 수정하여, 사용자가 로그인/로그아웃할 때마다 setAuthCookie와 clearAuthCookie를 각각 호출하도록 변경했습니다.

Modified File: @/context/auth.tsx
Content:
Update the useEffect hook in AuthProvider to call setAuthCookie and clearAuthCookie each time the user logs in or out.

⸻

4단계: Firebase와 Prisma 사용자 정보 동기화
데이터베이스 마이그레이션 후 발생하는 “User not found” 오류를 해결하기 위해, 두 데이터베이스 간의 사용자 정보를 동기화하는 로직을 추가했습니다.

Step 4: Synchronize Firebase and Prisma User Information
To resolve the “User not found” error after database migration, add logic to synchronize user information between the two databases.

⸻

생성된 파일: lib/user/actions.ts
내용:
findOrCreateUser 서버 액션을 생성했습니다.
이 함수는 Firebase uid를 기준으로 Prisma 데이터베이스에 사용자가 있는지 확인하고, 없으면 새로 생성하는 역할(Upsert)을 합니다.

Created File: lib/user/actions.ts
Content:
Create a findOrCreateUser server action.
This function checks whether a user exists in the Prisma database based on the Firebase UID, and if not, creates a new user (Upsert).

⸻

수정된 파일: @/context/auth.tsx
내용:
loginWithGoogle, loginWithEmail 함수 내부에 로그인 성공 직후 findOrCreateUser를 호출하는 로직을 추가하여, 항상 Prisma DB에 최신 사용자 정보가 있도록 보장했습니다.

Modified File: @/context/auth.tsx
Content:
Add logic in loginWithGoogle and loginWithEmail to call findOrCreateUser immediately after a successful login, ensuring the Prisma DB always has up-to-date user information.

⸻

5단계: 주문 목록 조회 서버 액션 생성
인증된 사용자가 자신의 주문 목록을 안전하게 조회할 수 있는 서버 액션을 만들었습니다.

Step 5: Create Server Action to Retrieve Order List
Create a server action that allows authenticated users to safely retrieve their order list.

⸻

생성된 파일: app/account/order/action.ts
내용:
getOrders 서버 액션을 생성했습니다. 이 함수는 다음을 수행합니다.
브라우저 쿠키에서 session 쿠키를 읽습니다.
auth.verifySessionCookie로 쿠키를 검증하여 사용자를 인증합니다.
Prisma를 사용하여 인증된 사용자의 모든 주문(Order)과 각 주문에 포함된 상품 목록(items) 및 결제 정보(payment)를 함께 조회합니다.

Created File: app/account/order/action.ts
Content:
Create a getOrders server action. This function:
Reads the session cookie from the browser.
Verifies the cookie using auth.verifySessionCookie to authenticate the user.
Uses Prisma to fetch all orders for the authenticated user, including the items in each order and payment information.

⸻

6단계: UI 구현 (서버/클라이언트 컴포넌트 분리)
초기 로딩 성능과 코드 유지보수성을 극대화하기 위해 페이지와 UI를 두 개의 컴포넌트로 분리하여 구현했습니다.

Step 6: Implement UI (Separate Server/Client Components)
To maximize initial loading performance and maintainability, implement the page using two separate components.

⸻

생성된 파일: app/orders/page.tsx (서버 컴포넌트)
내용:
페이지가 로드될 때 서버에서 직접 getOrders 서버 액션을 호출합니다.
인증에 실패하면 로그인 페이지로 리디렉션하고, 성공하면 조회된 orders 데이터를 아래 클라이언트 컴포넌트에 props로 전달합니다.

Created File: app/orders/page.tsx (Server Component)
Content:
When the page loads, call the getOrders server action directly on the server.
If authentication fails, redirect to the login page; if successful, pass the retrieved orders data as props to the client component below.

⸻

생성된 파일: app/orders/_components/OrderList.tsx (클라이언트 컴포넌트)
내용:
‘use client’로 선언되어 브라우저에서 실행됩니다.
부모로부터 받은 orders 데이터를 바탕으로 각 주문의 번호, 상품 목록 테이블, 총액 등을 화면에 렌더링하는 역할만 담당합니다.

Created File: app/orders/_components/OrderList.tsx (Client Component)
Content:
Declared with 'use client' to run in the browser.
Responsible only for rendering each order’s number, product list table, total amount, etc., based on the orders data received from the parent component.



## 주문 목록에 상품 이미지 및 링크 추가
## Feature: Add Product Images and Links to Order List
사용자가 주문 내역 페이지에서 구매한 상품을 시각적으로 쉽게 식별하고, 해당 상품의 상세 페이지로 바로 이동할 수 있도록 대표 이미지와 링크를 표시하는 기능을 추가했습니다.

A feature has been added to display a representative image and link for each product in the order history page, allowing users to easily identify purchased products visually and navigate directly to the product detail page.

⸻

# 구현 순서 및 파일 설명
# Implementation Steps and File Descriptions

⸻

1단계: 데이터베이스 스키마 확장
Step 1: Extend Database Schema

⸻

수정된 파일: prisma/schema.prisma
Modified File: prisma/schema.prisma

내용:
Content:

OrderItem 모델에 imageUrl: String? 필드를 추가했습니다. 필드를 선택적(?)으로 설정하여, 과거에 이미지가 없던 주문 데이터와의 호환성을 유지했습니다.
Added an imageUrl: String? field to the OrderItem model. The field is optional (?) to maintain compatibility with past order data that does not include images.

터미널에서 `npx prisma migrate dev –name add_image_url_to_order_item` 명령어를 실행하여 실제 데이터베이스에 변경사항을 적용했습니다.
Applied the changes to the database by running the command `npx prisma migrate dev --name add_image_url_to_order_item` in the terminal.

⸻

2단계: 결제 데이터 매핑 로직 수정
Step 2: Modify Checkout Data Mapping Logic

수정된 파일: lib/checkout.ts
Modified File: lib/checkout.ts

내용:
handleCheckout 함수 내부에서 cartItems를 API 요청 본문에 맞게 매핑하는 mappedCartItems 로직을 수정했습니다.
각 item 객체에 images 배열(상품의 전체 이미지 URL 목록)을 포함시켜 서버로 전달하도록 했습니다.
Content:
Updated the mappedCartItems logic inside the handleCheckout function to map cartItems according to the API request body.Included an images array (full list of product image URLs) in each item object to be sent to the server.

⸻

3단계: 주문 생성 시 이미지 URL 저장
Step 3: Save Image URL When Creating Orders

수정된 파일: app/api/payment/route.ts
Modified File: app/api/payment/route.ts

내용: 
Content:
prisma.order.create 함수 내부, items를 생성하는 로직을 수정했습니다.
cartItems의 각 item에 포함된 images 배열의 첫 번째 요소(item.images[0])를 OrderItem의 imageUrl 필드에 저장하도록 했습니다. 이미지가 없는 경우를 대비해 null을 저장하는 방어 로직도 추가했습니다.
Updated the logic that creates items inside the prisma.order.create function.
Saved the first element of the images array from each cartItem (item.images[0]) into the OrderItem’s imageUrl field. Added a fallback logic to store null if no image exists.

⸻

4단계: UI 컴포넌트에 이미지 및 링크 렌더링
Step 4: Render Images and Links in UI Component

수정된 파일: app/orders/_components/OrderList.tsx
Modified File: app/orders/_components/OrderList.tsx

내용:
Content:
OrderItem의 TypeScript 타입 정의에 imageUrl: string | null과 productId: string 속성을 추가했습니다.
next/image 컴포넌트를 사용하여 item.imageUrl 경로의 이미지를 표시했습니다. 이미지가 null일 경우에는 기본 플레이스홀더 UI가 보이도록 처리했습니다.
next/link 컴포넌트를 사용하여 상품 이미지와 상품명에 /products/${item.productId} 경로로 이동하는 링크를 추가했습니다.
Added imageUrl: string | null and productId: string properties to the OrderItem TypeScript type.
Displayed the image from item.imageUrl using the next/image component, showing a default placeholder UI if the image is null. Added links on the product image and name using next/link to navigate to /products/${item.productId}.