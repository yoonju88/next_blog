<div align="right">

🌐 **Languages**  
[🇺🇸 English](./README.md) |[🇫🇷 Français](./README.fr.md)

</div>

# 🏪 Next.js E-Commerce Platform

> 현대적인 풀스택 전자상거래 플랫폼 - Next.js 15, Firebase, Prisma를 활용한 실전 프로젝트

---

## 🌐 데모 사이트
프로덕션 사이트: https://coscoree.vercel.app

---

## 🔐 테스트 계정

### **관리자 계정**
- **이메일:** hoyoonju2@gmail.com  
- **비밀번호:** TestAdmin12*/

### **일반 사용자 계정**
- **이메일:** cosmk.ho@gmail.com  
- **비밀번호:** TestUser88=*/  

---

## 💳 Stripe 테스트 결제 정보

Stripe 테스트 모드에서는 아래 결제 정보를 사용하세요:

- **카드 번호:** 4242 4242 4242 4242  
- **만료일:** 미래 날짜 아무거나  
- **CVC:** 아무 3자리 숫자  
- **우편번호:** 아무 5자리 숫자  

---

## 📸 스크린샷

### **사용자 화면**

![홈 화면](./docs/Home.png)  
*메인 홈 화면*

![상품 상세 화면](./docs/detail.png)  
*상품 상세 페이지*

![장바구니](./docs/cart.png)  
*장바구니 — 결제 전 실시간 가격 계산*

---

### **관리자 대시보드**

![관리자 주문 리스트](./docs/admin-i.png)  
*관리자 대시보드 — 주문 리스트 관리*

![관리자 상품 관리](./docs/admin-p.png)  
*관리자 대시보드 — 상품 관리*

![관리자 배너 관리](./docs/admin-b.png)  
*관리자 대시보드 — 배너 이미지 관리*

---

## 📖 프로젝트 소개

이 프로젝트는 **실제 운영 가능한 이커머스 웹사이트**를 목표로 설계되었습니다.
단순한 기술 데모가 아니라, 실제 서비스에서 요구되는 사용자 인증, 상품 및 재고 관리, 결제 처리, 주문 관리를 포함한 핵심 기능을 모두 개발하였으며
이를 통해 풀스택 웹 개발에 대한 제 역량과 시스템 설계 능력을 효과적으로 보여주고자 했습니다.

### 🎯 프로젝트 목표

1. **완전한 E-Commerce 경험 제공**
   - 고객이 상품을 탐색하고, 장바구니에 담고, 실제로 결제까지 완료할 수 있는 전체 플로우 구현

2. **최신 기술 스택 활용**
   - Next.js 15의 App Router와 Server Actions를 활용한 최신 React 패턴 적용
   - TypeScript로 타입 안정성 확보

3. **확장 가능한 아키텍처**
   - Firebase와 PostgreSQL의 장점을 결합한 하이브리드 데이터베이스 구조
   - 관심사의 분리(Separation of Concerns)를 통한 유지보수성 향상

4. **실무 수준의 코드 품질**
   - 에러 핸들링, 보안, 성능 최적화까지 고려한 프로덕션 레디 코드

---

## 🏗️ 아키텍처 설계 철학

### 왜 이런 구조를 선택했을까?

#### 1️⃣ **하이브리드 데이터베이스 전략**
![Data Structure Diagram](./docs/Datastructure.png)

**선택 이유:**
- **Firebase**: 빠른 읽기/쓰기, 실시간 동기화, 쉬운 파일 업로드 (상품 이미지 등)
- **PostgreSQL + Prisma**: 복잡한 관계 데이터, ACID 트랜잭션 보장 (결제는 절대 실패하면 안 됨!)

#### 2️⃣ **Next.js 15 App Router + Server Actions**

**선택 이유:**
- 🚀 **성능**: 서버 컴포넌트로 초기 로딩 속도 향상 (SEO에도 유리)
- 🔒 **보안**: 민감한 로직을 서버에서 처리 (API 키, 결제 처리 등)
- 🎨 **개발자 경험**: 클라이언트/서버 코드를 하나의 파일에서 관리

```typescript
// 기존 방식: API Route + fetch
await fetch('/api/orders', { method: 'POST' })

// 새로운 방식: Server Action (더 간단하고 타입 안전!)
await createOrder(orderData)
```

#### 3️⃣ **인증: Firebase Auth + Session Cookies**

**선택 이유:**
- Firebase Auth의 간편한 소셜 로그인 (Google, Email/Password)
- Session Cookie로 서버 컴포넌트에서도 안전하게 인증 상태 확인
- `httpOnly` 쿠키로 XSS 공격 방지

---

## ✨ 핵심 기능

### 🛒 쇼핑 경험

| 기능 | 설명 | 사용 기술 |
|------|------|-----------|
| **상품 탐색** | 검색, 필터링, 정렬 기능 | React Hook Form, Zod |
| **장바구니** | 실시간 수량 변경, 가격 계산 | Firebase Firestore |
| **리뷰 기능** | 리뷰 작성, 수정, 삭제 실시간 반영 | Firebase |
| **위시리스트** | 상품 좋아요 추가 및 삭제 | Firebase |
| **쿠폰 적용** | 할인 적용 및 사용여부 검증 | Firebase, Prisma |
| **포인트 사용** | 주문시 포인트 사용 및 적립  | Prisma |
| **상품 검색/ 필터링** | 카테고리별 필터, 상품 검색  | Firebase, client filter|

### 💳 결제 시스템
![Data Payment Diagram](./docs/paymentdiagram.png) 

**왜 Stripe를 선택했나?**
- 🌍 국제 표준 결제 솔루션
- 🔐 PCI-DSS 준수 (카드 정보를 우리 서버에 저장 안 함)
- 🧪 개발자 친화적 (테스트 모드, 상세한 문서)

### 👨‍💼 관리자 기능

| 기능 | 설명 | 사용 기술 |
|------|------|-----------|
| **상품 관리** | 상품 생성, 수정, 삭제 및 이미지 업로드 | Firebase, Next.js Server Actions |
| **배너 관리** | 홈페이지 배너 이미지 추가, 삭제, 수정 | Firebase Storage, Firestore |
| **메뉴 이미지 관리** | 카테고리/메뉴 이미지 CRUD | Firebase |
| **세일/프로모션 설정** | 상품 세일 여부 설정 및 세일 가격 관리 | Firebase |
| **쿠폰 관리** | 쿠폰 등록, 삭제, 기간 설정, 사용자 사용 여부 검증 | Firebase, Prisma |
| **주문 관리** | 사용자 주문 리스트 조회 및 상태 업데이트 | Prisma, Server Components |
| **사이트 콘텐츠 관리** | 홈 화면에 표시되는 컨텐츠 관리 | Firebase |
| **관리자 대시보드** | 매출, 주문량, 상품 통계 데이터 시각화 | Prisma, Server Components |


**권한 관리:**
```typescript
// Prisma Schema
model User {
  isAdmin Boolean @default(false)  // 관리자 플래그
}
```

---

## 🔧 주요 기술 선택 이유

### 프론트엔드

| 기술 | 사용 이유 |
|------|-----------|
| **Tailwind CSS 4** | 빠른 UI 개발, 일관된 디자인 시스템 |
|**shadcn/ui (Radix UI 기반)** | 접근성 높은 동작을 기반으로 한 스타일 적용 가능 UI 컴포넌트 |
| **React Hook Form** | 성능 최적화된 폼 관리 |
| **Zod** | 런타임 타입 검증 (서버/클라이언트 모두) |

### 백엔드

| 기술 | 사용 이유 |
|------|-----------|
| **Prisma** | 타입 안전한 ORM, 쉬운 마이그레이션 |
| **Firebase Admin SDK** | 서버에서 안전한 Firebase 작업 |
| **Next.js API Routes** | 풀스택을 하나의 프로젝트에서 관리 |

---

## 🚀 시작하기

### 필수 조건

- Node.js 18+
- PostgreSQL 데이터베이스
- Firebase 프로젝트
- Stripe 계정

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/yoonju88/next_blog.git
cd next_blog

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env.local


# 4. 데이터베이스 마이그레이션
npx prisma migrate dev

# 5. 개발 서버 실행
npm run dev
```
---

## 📂 프로젝트 구조

```
next_blog/
├── app/                                   # Next.js App Router
│   ├── (auth)/                            # 로그인, 회원가입, 비밀번호 찾기 등
│   ├── (shop)/                            # 쇼핑 관련 페이지 (상품 목록, 상세 등)
│   ├── account/                           # 사용자 마이페이지
│   ├── admin/                             # 관리자 페이지 (상품/배너/메뉴 관리)
│   └── api/                               # API Routes
│       ├── payment/                       # 결제 관련 API
│       └── cart/                          # 장바구니 관련 API
│
├── components/                            # React 컴포넌트
│   ├── ui/                                # shadcn/ui 기반 공용 UI
│   └── admin/                             # 관리자 전용 컴포넌트
│
├── context/                               # 글로벌 상태 관리 (Context API)
│   ├── AuthContext.tsx                    # 인증 상태 관리
│   ├── CartContext.tsx                    # 장바구니 상태 관리
│   └── FilterContext.tsx                  # 검색/필터 상태
│
├── data/                                  # 정적 데이터, 옵션, 더미 데이터
├── docs/                                  # 문서용 이미지, 다이어그램
│   └── Datastructure.png                  # DB 구조/아키텍처 이미지 등
│
├── firebase/                              # Firebase 설정
│   ├── client.ts                          # Firebase 클라이언트 SDK
│   └── server.ts                          # Firebase Admin SDK
│
├── function/                              # 서버 측 유틸 함수, service layer
├── generated/                             # Prisma / 기타 자동 생성 파일
│
├── hooks/                                 # 커스텀 훅
│   ├── use-mobile.ts                      # 모바일 판단 훅
│   └── useUserPoints.ts                   # 사용자 포인트 훅
│
├── lib/                                   # API, 인증, 서비스 레이어 유틸
│   ├── auth/                              # 인증 서비스 함수
│   ├── user/                              # 유저 관련 서비스 함수
│   └── prisma.ts                          # Prisma 클라이언트 생성
│
├── prisma/                                # Prisma ORM 설정
│   └── schema.prisma                      # DB 스키마 정의
│
├── public/                                # 정적 파일 (이미지, 아이콘)
├── scripts/                               # 빌드/배포/개발 스크립트
├── types/                                 # TypeScript 전역 타입
├── utils/                                 # 순수 유틸 함수
├── validation/                            # Zod 기반 입력 검증 스키마
│
├── package.json
├── tsconfig.json
└── README.md (EN, KR, FR)
```

---

## 💡 개발하면서 배운 점들

### 1. **Prisma와 Firebase를 함께 사용하는 이유**

전자상거래 서비스에서는 데이터 종류마다 필요한 성능과 안정성이 다릅니다.
그래서 하나의 DB로 모든 데이터를 처리하면 비효율이 생길 수 있습니다.

Firebase와 PostgreSQL을 함께 사용하는 이유는 각각의 장점을 정확히 살리기 위해서입니다.
데이터의 성질에 따라 최적의 저장소를 선택하기 위해
Firebase(실시간/유연성) + PostgreSQL(정합성/트랜잭션)을 함께 사용하였습니다.

# 🔥 Firebase (NoSQL)

   •	실시간 업데이트
	•	빠른 조회
	•	유연한 구조
	•	사용자 경험 중심 데이터에 적합

빠르게 변하고 실시간 반응이 필요한 데이터에 최적화되어 있으므로 
장바구니, 리뷰, 좋아요, 상품 정보, 프로모션 이미지, 사용자 정보 등
UI 중심 데이터는 Firebase가 훨씬 효율적입니다.

# 🧊 PostgreSQL (SQL)

	•	ACID 트랜잭션
	•	관계형 구조
	•	결제·주문·포인트 같은 민감한 정보 처리 가능

정확성과 안정성이 중요한 핵심 데이터에 적합하므로 주문, 결제, 재고, 쿠폰, 포인트 등
비즈니스 로직의 중심이 되는 데이터는 PostgreSQL이 더 안전합니다.


### 2. **Server Actions의 진정한 가치**

```typescript
// Before: 복잡한 API Route + fetch
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
const result = await response.json()

// After: 간단한 Server Action
const result = await createOrder(data)
```

**교훈:**
- 간단한 작업에는 Server Actions이 훨씬 효율적
- 타입 안정성도 자동으로 확보됨

### 3. **결제 시스템 구현의 어려움**

결제 기능은 서비스 전체에서 가장 민감하고 절대 실패하면 안 되는 영역입니다.
그래서 구현할 때 특히 많은 신경을 썼습니다.

- Prisma 트랜잭션을 활용해 주문·결제 데이터의 정합성을 보장하고
- Stripe Webhook을 통해 실제 결제가 완료되었는지 서버에서 한 번 더 확인하도록 추후 구현 예정입니다.
- 예상치 못한 문제에 대비해 에러 처리 흐름도 촘촘하게 다듬었습니다.
      서버에서 Stripe 결제를 한 번 더 재확인
      주문·결제·재고를 트랜잭션으로 묶어 하나라도 실패하면 롤백되도록
	   Webhook 중복 호출이나 Stripe API 오류에도 대응할 수 있도록 안전장치를 마련할 예정입니다.

**교훈:**
- 돈과 관련된 기능은 테스트를 수십 번 할 것
- 모든 엣지 케이스를 고려할 것

---

## 🐛 트러블슈팅 경험

### 문제 1: Prisma Client 초기화 에러

```
Error: @prisma/client did not initialize yet
```

**원인:** Next.js 15의 webpack 번들링 시스템과 충돌

**해결:**
```typescript
// next.config.ts
export default {
  serverExternalPackages: ['@prisma/client', 'prisma']
}
```

### 문제 2: 결제 후 장바구니가 안 비워지는 버그

**원인:** Firestore의 데이터 구조를 서브컬렉션으로 잘못 이해함

**해결:** 
- 실제 구조는 `users/{uid}/cart: []` (배열 필드)
- `update({ cart: [] })`로 직접 업데이트

**교훈:** 데이터 구조를 명확히 이해하고 문서화할 것!

---

## 🔜 향후 계획

- [ ] 💌 이메일 알림 시스템 (주문 확인, 배송 알림)
- [ ] ✉️ Contact / inquiry 메일 시스템 구축
- [ ] 🔔 Stripe Webhook 완전 통합
- [ ] 📊 데이터 인사이트가 포함된 고급 관리자 통계 대시보드
- [ ] 🤖 AI 기반 자동 데이터 생성 기능 (상품 메타데이터, 요약 등)
- [ ] 📱 반응형 디자인 개선
- [ ] 🧪 자동 테스트 도입 (Playwright 기반 E2E 테스트 + Jest 단위 테스트)

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.
해당 라이선스는 소프트웨어를 자유롭게 사용·복사·수정·배포할 수 있는 매우 유연한 오픈소스 라이선스입니다.
Copyright (c) 2025 TERRENOIRE HO Yoonju
---

## 🙏 참고 자료

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Firebase Documentation](https://firebase.google.com/docs)

---

## 📧 문의

프로젝트에 대한 질문이나 제안이 있으시면 이슈를 열어주세요!

---

**⭐ 이 프로젝트가 도움이 되었다면 스타를 눌러주세요!**