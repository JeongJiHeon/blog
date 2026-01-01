# 세종 행정사무소 블로그

외국인 등록, 비자 연장 등 행정 서비스를 제공하는 행정사무소 홍보 블로그입니다.

## 기능

- **블로그**: 다국어 게시글 (한국어/영어/중국어)
- **문의 게시판**: 비밀글 지원, 관리자 답변
- **관리자 모드**: 게시글 CRUD, 문의 관리
- **다국어 지원**: 한국어, English, 中文
- **카카오톡 상담**: 플로팅 버튼

## 기술 스택

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- react-i18next

### Backend
- FastAPI (Python)
- SQLite
- SQLAlchemy
- JWT Authentication

## 시작하기

### 1. Backend 설정

```bash
cd backend

# 가상환경 생성 (선택)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 패키지 설치
pip install -r requirements.txt

# 환경 변수 설정
cp .env.example .env

# 데이터베이스 초기화 및 시드 데이터
python scripts/init_db.py
python scripts/seed_data.py

# 서버 실행
uvicorn app.main:app --reload
```

Backend: http://localhost:8000
API 문서: http://localhost:8000/docs

### 2. Frontend 설정

```bash
cd frontend

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

Frontend: http://localhost:5173

## 관리자 계정

- **아이디**: admin
- **비밀번호**: admin1234

⚠️ 프로덕션 환경에서는 반드시 비밀번호를 변경하세요!

## 프로젝트 구조

```
01.Blog/
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── components/     # UI 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── contexts/       # React Context
│   │   ├── hooks/          # Custom Hooks
│   │   ├── lib/            # 유틸리티
│   │   └── types/          # TypeScript 타입
│   └── public/locales/     # 다국어 번역 파일
│
├── backend/                # FastAPI 백엔드
│   ├── app/
│   │   ├── models/         # SQLAlchemy 모델
│   │   ├── schemas/        # Pydantic 스키마
│   │   ├── routers/        # API 라우터
│   │   ├── middleware/     # 미들웨어
│   │   └── utils/          # 유틸리티
│   ├── scripts/            # DB 초기화 스크립트
│   └── data/               # SQLite DB, 업로드 파일
│
└── README.md
```

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 관리자 로그인
- `GET /api/auth/me` - 현재 사용자 정보

### 게시글
- `GET /api/posts` - 공개 글 목록
- `GET /api/posts/{id}` - 글 상세
- `POST /api/posts` - 글 생성 (Admin)
- `PUT /api/posts/{id}` - 글 수정 (Admin)
- `DELETE /api/posts/{id}` - 글 삭제 (Admin)

### 문의
- `GET /api/contacts` - 문의 목록
- `POST /api/contacts` - 문의 작성
- `GET /api/contacts/{id}` - 문의 상세
- `POST /api/contacts/{id}/verify` - 비밀글 비밀번호 확인

### 관리자
- `GET /api/admin/dashboard` - 대시보드 통계
- `GET /api/admin/posts` - 전체 글 목록 (비공개 포함)
- `GET /api/admin/contacts` - 전체 문의 목록
- `PUT /api/admin/contacts/{id}/reply` - 답변 작성

## 환경 변수

### Backend (.env)
```
DATABASE_URL=sqlite:///./data/blog.db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=http://localhost:5173
```

## 카카오톡 상담 설정

`frontend/src/components/common/KakaoFloatingButton.tsx` 파일에서
오픈채팅 URL을 수정하세요:

```typescript
const KAKAO_CHAT_URL = 'https://open.kakao.com/o/gXXXXXXX'
```

## 확장 포인트 (TODO)

코드에 `// TODO:` 주석으로 확장 가능한 기능들이 표시되어 있습니다:

- 카테고리/태그 기능
- 검색 기능
- 이미지 업로드
- 첨부파일 지원
- 통계 대시보드 시각화
- 추가 언어 지원
- 지도 연동
