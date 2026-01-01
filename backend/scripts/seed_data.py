#!/usr/bin/env python3
"""
Seed the database with mock data for development.
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.post import Post
from app.models.contact import Contact
from app.utils.security import get_password_hash


MOCK_POSTS = [
    {
        "title_ko": "세종 행정사무소 오픈 안내",
        "title_en": "Sejong Administrative Office Opening Announcement",
        "title_zh": "世宗行政事务所开业公告",
        "content_ko": """안녕하세요. 세종 행정사무소가 새롭게 문을 열었습니다.

저희 사무소는 외국인 등록, 비자 연장, 체류자격 변경 등 다양한 행정 서비스를 제공합니다.

**영업 시간**
- 평일: 09:00 - 18:00
- 토요일: 10:00 - 14:00
- 일요일/공휴일: 휴무

**위치**
세종시 조치원읍 행정중심로 123

많은 관심 부탁드립니다.""",
        "content_en": """Hello. Sejong Administrative Office has newly opened.

Our office provides various administrative services including alien registration, visa extension, and status of residence change.

**Business Hours**
- Weekdays: 09:00 - 18:00
- Saturday: 10:00 - 14:00
- Sunday/Holidays: Closed

**Location**
123 Administrative Center Road, Jochiwon-eup, Sejong City

We look forward to serving you.""",
        "content_zh": """您好。世宗行政事务所正式开业了。

我们事务所提供外国人登录、签证延期、居留资格变更等多种行政服务。

**营业时间**
- 工作日：09:00 - 18:00
- 星期六：10:00 - 14:00
- 星期日/节假日：休息

**地址**
世宗市鸟致院邑行政中心路123号

期待为您服务。""",
        "is_public": True,
        "thumbnail_url": None
    },
    {
        "title_ko": "비자 연장 서류 안내",
        "title_en": "Visa Extension Document Guide",
        "title_zh": "签证延期所需材料指南",
        "content_ko": """비자 연장에 필요한 서류를 안내해 드립니다.

## 필수 서류

1. **여권** - 유효기간 6개월 이상
2. **외국인등록증**
3. **통합신청서**
4. **수수료** - 6만원 (체류자격에 따라 다름)

## 추가 서류 (체류자격별)

### E-9 (비전문취업)
- 근로계약서
- 사업자등록증 사본
- 재직증명서

### D-4 (일반연수)
- 재학증명서
- 성적증명서
- 출석률 증명서

### F-6 (결혼이민)
- 혼인관계증명서
- 배우자 신분증 사본
- 주거 증빙서류

문의사항이 있으시면 연락 주세요.""",
        "content_en": """Here is a guide for visa extension documents.

## Required Documents

1. **Passport** - Valid for at least 6 months
2. **Alien Registration Card**
3. **Integrated Application Form**
4. **Fee** - 60,000 KRW (varies by visa type)

## Additional Documents (By Visa Type)

### E-9 (Non-professional Employment)
- Employment contract
- Business registration certificate copy
- Certificate of employment

### D-4 (General Training)
- Certificate of enrollment
- Academic transcript
- Attendance certificate

### F-6 (Marriage Migration)
- Marriage certificate
- Spouse's ID copy
- Residence proof documents

Please contact us if you have any questions.""",
        "content_zh": """以下是签证延期所需材料指南。

## 必需材料

1. **护照** - 有效期6个月以上
2. **外国人登录证**
3. **综合申请表**
4. **手续费** - 6万韩元（根据居留资格有所不同）

## 追加材料（按居留资格）

### E-9（非专业就业）
- 劳动合同
- 营业执照副本
- 在职证明

### D-4（一般研修）
- 在学证明
- 成绩证明
- 出勤率证明

### F-6（结婚移民）
- 婚姻关系证明
- 配偶身份证复印件
- 住所证明材料

如有疑问，请与我们联系。""",
        "is_public": True,
        "thumbnail_url": None
    },
    {
        "title_ko": "외국인 등록 절차 안내",
        "title_en": "Alien Registration Procedure Guide",
        "title_zh": "外国人登录手续指南",
        "content_ko": """외국인 등록 절차에 대해 상세히 안내해 드립니다.

## 신청 대상

대한민국에 90일 이상 체류하는 외국인

## 신청 기간

입국 후 90일 이내

## 필요 서류

1. 여권
2. 통합신청서
3. 사진 1장 (3.5cm x 4.5cm)
4. 수수료 3만원
5. 체류자격별 추가 서류

## 절차

1. 관할 출입국관리사무소 방문 (또는 행정사무소 대행)
2. 서류 제출
3. 지문 채취
4. 외국인등록증 발급 (약 2-3주 소요)

저희 사무소에서 대행 서비스를 제공합니다. 편하게 문의해 주세요.""",
        "content_en": """Here is a detailed guide on the alien registration procedure.

## Eligibility

Foreigners staying in Korea for more than 90 days

## Application Period

Within 90 days after entry

## Required Documents

1. Passport
2. Integrated Application Form
3. 1 Photo (3.5cm x 4.5cm)
4. Fee: 30,000 KRW
5. Additional documents by visa type

## Procedure

1. Visit the immigration office (or use our agency service)
2. Submit documents
3. Fingerprint registration
4. Receive Alien Registration Card (takes about 2-3 weeks)

Our office provides agency services. Please feel free to contact us.""",
        "content_zh": """以下是关于外国人登录手续的详细指南。

## 申请对象

在韩国停留90天以上的外国人

## 申请期限

入境后90天以内

## 所需材料

1. 护照
2. 综合申请表
3. 照片1张（3.5cm x 4.5cm）
4. 手续费3万韩元
5. 按居留资格需要的追加材料

## 手续流程

1. 前往管辖出入境管理事务所（或委托我们事务所代办）
2. 提交材料
3. 采集指纹
4. 领取外国人登录证（约需2-3周）

我们事务所提供代办服务，请随时咨询。""",
        "is_public": True,
        "thumbnail_url": None
    },
    {
        "title_ko": "체류자격 변경 안내 (작성 중)",
        "title_en": "Status of Residence Change Guide (Draft)",
        "title_zh": "居留资格变更指南（草稿）",
        "content_ko": "체류자격 변경에 관한 상세 내용은 곧 업데이트됩니다.",
        "content_en": "Detailed information about status of residence change will be updated soon.",
        "content_zh": "关于居留资格变更的详细信息即将更新。",
        "is_public": False,  # Draft post
        "thumbnail_url": None
    }
]

MOCK_CONTACTS = [
    {
        "name": "홍길동",
        "contact": "010-1234-5678",
        "message": "안녕하세요. 비자 연장 관련 문의드립니다. E-9 비자를 가지고 있는데, 연장 신청은 만료 얼마 전에 하면 되나요? 필요한 서류도 알려주시면 감사하겠습니다.",
        "is_secret": False,
        "secret_password": None,
        "admin_reply": "안녕하세요, 홍길동님. 문의해 주셔서 감사합니다.\n\nE-9 비자 연장은 만료일 4개월 전부터 신청 가능합니다. 필요 서류는 다음과 같습니다:\n1. 여권\n2. 외국인등록증\n3. 근로계약서\n4. 사업자등록증 사본\n5. 재직증명서\n\n추가 문의사항이 있으시면 언제든 연락 주세요.",
        "is_read": True
    },
    {
        "name": "John Smith",
        "contact": "john.smith@email.com",
        "message": "Hello. I need help with my visa application. I'm currently on a D-4 visa and want to change to E-7. What documents do I need?",
        "is_secret": True,
        "secret_password": "test1234",
        "admin_reply": None,
        "is_read": False
    },
    {
        "name": "김영희",
        "contact": "010-9876-5432",
        "message": "상담 가능한 시간이 언제인가요? 외국인 등록증 분실 신고를 하려고 합니다.",
        "is_secret": False,
        "secret_password": None,
        "admin_reply": None,
        "is_read": False
    },
    {
        "name": "李明",
        "contact": "weixin_liming",
        "message": "您好，我想咨询一下结婚签证的问题。我是中国人，我的未婚夫是韩国人。请问我们需要准备什么材料？",
        "is_secret": True,
        "secret_password": "secret123",
        "admin_reply": None,
        "is_read": False
    }
]


def seed_posts(db):
    """Seed posts data."""
    print("Seeding posts...")
    for post_data in MOCK_POSTS:
        post = Post(**post_data)
        db.add(post)
    db.commit()
    print(f"  Created {len(MOCK_POSTS)} posts")


def seed_contacts(db):
    """Seed contacts data."""
    print("Seeding contacts...")
    for contact_data in MOCK_CONTACTS:
        # Hash password if present
        if contact_data.get("secret_password"):
            contact_data["secret_password"] = get_password_hash(contact_data["secret_password"])
        contact = Contact(**contact_data)
        db.add(contact)
    db.commit()
    print(f"  Created {len(MOCK_CONTACTS)} contacts")


def main():
    db = SessionLocal()
    try:
        # Check if data already exists
        existing_posts = db.query(Post).count()
        existing_contacts = db.query(Contact).count()

        if existing_posts > 0 or existing_contacts > 0:
            print("Database already has data. Skipping seed.")
            print(f"  Posts: {existing_posts}")
            print(f"  Contacts: {existing_contacts}")
            return

        seed_posts(db)
        seed_contacts(db)
        print("\nSeeding complete!")

    finally:
        db.close()


if __name__ == "__main__":
    main()
