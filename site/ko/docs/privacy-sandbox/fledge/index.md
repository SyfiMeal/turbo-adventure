---
layout: 'layouts/doc-post.njk'
title: FLEDGE
subhead: 사용 사례의 리마케팅이 가능하지만 제3자가 사이트 전반의 사용자 브라우징 행동을 추적하는 데 사용할 수 없도록 설계된 솔루션
description: FLEDGE는 리마케팅 사용 사례를 충족하지만 제3자가 사이트 전반의 사용자 브라우징 행동을 추적하는 데 이를 사용할 수 없도록 설계되었습니다. 이 API는 사용자가 이전에 방문한 웹사이트에서 제공하는 관련 광고를 선택하기 위해 브라우저에 의한 장치 내 "경매"를 지원합니다.
date: 2021-05-18
updated: 2021-05-18
authors:
  - samdutton
---

<!--lint disable no-smart-quotes-->

## 구현 현황

- [API 제안](https://github.com/WICG/turtledove/blob/master/FLEDGE.md)이 [WICG](https://www.w3.org/community/wicg/) 및 이익 단체에서 논의 중
- [Blink](https://groups.google.com/a/chromium.org/g/blink-dev/c/w9hm8eQCmNI)의 [프로토타입 의도](https://groups.google.com/a/chromium.org/g/blink-dev/c/w9hm8eQCmNI)

{% Aside %}
FLEDGE는 [TURTLEDOVE](https://github.com/WICG/turtledove)에서 파생되었습니다.
{% endAside %}

## FLEDGE가 필요한 이유는 무엇입니까?

사용자 관심사를 이해하면 단순히 사이트 콘텐츠(컨텍스트 타겟팅)를 기반으로 광고를 선택하거나 광고가 표시되는 사이트에 사용자가 제공한 정보(자사 데이터 타겟팅)를 사용하여 광고를 선택하는 것보다 더 관련성 높은 광고를 게재할 수 있습니다. 전통적으로 광고 플랫폼은 사이트 전반에서 사용자의 행동을 추적하여 사용자의 관심 분야를 알아냈습니다. 사이트 간 추적 없이 사용자에게 관련성 있는 광고를 제공할 방법이 필요합니다.

FLEDGE는 [리마케팅](/privacy-sandbox/glossary/#remarketing) 사용 사례를 충족하지만 제3자가 사용자의 브라우징 행동을 추적하는 데 이를 사용할 수 없도록 설계되었습니다. 이 API는 사용자가 이전에 방문한 웹사이트를 바탕으로 관련 광고를 선택하기 위해 브라우저에 의한 장치 내 "경매"를 지원합니다.

FLEDGE를 도입할 경우:

- 광고주나 애드테크 플랫폼이 아닌 사용자의 브라우저가 사용자의 브라우저와 연관된 광고주 정의 관심 그룹을 저장합니다.
- 사용자의 브라우저는 관심 그룹 데이터와 광고 구매자/판매자 데이터 및 비즈니스 로직을 결합하여 광고를 선택하기 위한 "경매"를 수행합니다. 이 광고 경매는 제3자와 데이터를 공유하지 않고 사용자의 기기에서 로컬로 이루어집니다.
- 관심 그룹에 대해 광고를 선택할 수 있지만 광고주는 관심 그룹 데이터를 사용자에 대한 다른 정보, 특히 사용자 신원이나 사용자가 방문하는 페이지와 결합할 수 없습니다. 광고주는 게시자 사이트에서 사용자가 보는 페이지에 대해 알 수 없습니다.
- 웹사이트와 해당 사이트에서 사용하는 광고 네트워크는 방문자의 광고 관심 분야 또는 관심 그룹에 대해 알 수 없습니다. 광고 선택은 사용자의 브라우저에서 이루어집니다.

즉, FLEDGE는 사용자의 관심사와 브라우징 활동을 비공개로 유지합니다. 예를 들어 온라인 신발 매장을 방문하여 운동화에 관심을 보인 다음 광고를 게재하는 뉴스 사이트(게시자)를 방문한다고 했을 때 광고주(신발 매장)는 사용자가 뉴스 사이트에서 보고 있는 페이지를 알지 못하고, 게시자(뉴스 사이트)는 운동화에 대한 사용자의 관심에 대해 알지 못합니다.

## FLEDGE는 어떻게 작동합니까?

사용자가 제품이나 서비스를 광고하려는 사이트(광고주)의 페이지를 방문하면 사이트는 사용자의 브라우저에 특정 기간(예: 30일) 동안 특정 관심 그룹과 사용자를 연결하도록 요청할 수 있습니다.

관심 그룹은 리마케팅 목록의 기능을 하도록 광고주의 웹사이트에 고유할 수 있습니다. 또는 여러 웹사이트가 사용자를 동일한 관심 그룹에 할당하는 데 합의할 수 있습니다. 사이트가 함께 파트너 관계를 맺거나 동일한 광고 네트워크에 속하는 경우를 예로 들 수 있습니다. 사용자의 브라우저는 주기적으로 관심 그룹에 대해 지정된 광고와 함께 관심 그룹과 연결된 광고가 기기 내 경매(예: 페이지 상단 근처에 광고가 있는 인벤토리에서만) 입찰에 적합한 시기와 관련하여 광고주의 지침을 제공하는 코드를 가져옵니다. FLEDGE API를 사용하여 광고를 수락하고 사용자가 이전에 방문한 광고주 사이트에서 사용하는 광고 네트워크의 광고를 표시하도록 구성된 게시자 사이트를 사용자가 방문하는 경우, 페이지의 광고 네트워크 코드가 브라우저에 "경매" 코드를 실행하여 광고를 선택할 것을 요청합니다. "경매에서 낙찰된" 광고가 표시됩니다.

1. 사용자는 온라인 상점과 같이 제품을 광고하려는 사이트의 페이지를 방문합니다.
2. 광고주 사이트(또는 사용하는 애드테크)는 사용자의 브라우저에 joinAdInterestGroup()을 호출하여 광고 '관심 그룹'에 가입하도록 요청하고 사용자의 브라우징과 관련된 광고, 광고 플랫폼 호스트 이름 및 입찰 로직과 입찰 신호에 액세스하기 위한 URL 등의 데이터를 전달합니다.
3. 사용자는 광고를 표시하고 FLEDGE를 사용하여 선택된 광고를 수락하도록 구성된 뉴스 게시자와 같은 사이트를 방문합니다.
4. 사용자의 브라우저는 FLEDGE 선택 광고를 수락할 수 있는 인벤토리(광고 슬롯)에 들어갈 광고를 선택하기 위해 '경매'를 실행합니다. 이 경매의 '판매자'는 사이트 자체 또는 공급측 플랫폼과 같이 사이트를 대신하는 제3자가 될 수 있습니다. '구매자'는 광고주를 대신하는 수요측 플랫폼과 같이 사이트의 광고 인벤토리에 입찰하는 제3자입니다. 이 광고 경매의 판매자는 세 가지 작업을 수행합니다.<br> • 어떤 구매자가 참여할 수 있는지 선택합니다.<br> • 각 입찰의 가격과 메타데이터를 기반으로 가장 바람직한 입찰가를 선택합니다.<br> • 경매 결과를 보고합니다.<br>
5. 판매자는 판매자의 호스트 이름, 구매자와 판매자의 신호, 경매 결정 로직을 위한 URL 등의 데이터와 함께 runAdAuction()을 호출하여 광고 경매를 시작합니다.
6. 경매 결과로 낙찰된 광고에 대한 데이터가 반환됩니다. Fenced Frame에 광고를 렌더링하는 경우를 제외하고 게시자 사이트에서 데이터에 액세스할 수 없습니다.
7. 광고가 표시됩니다.

---

## 참여 및 피드백 공유

- **GitHub**: [제안](https://github.com/WICG/turtledove/blob/master/FLEDGE.md)을 읽고 [질문을 제기하고 토론에 참여하세요](https://github.com/WICG/turtledove/issues).
- **W3C**: [웹 광고 개선 비즈니스 그룹](https://www.w3.org/community/web-adv/participants)에서 업계 사용 사례에 대해 논의하세요.
- **개발자 지원**: [개인정보 보호 샌드박스 개발자 지원 저장소](https://github.com/GoogleChromeLabs/privacy-sandbox-dev-support)에서 질문을 하고 토론에 참여하세요.

## 더 많은 리소스 찾아보기

- [FLEDGE API 기술 설명자](https://github.com/WICG/turtledove/blob/master/FLEDGE.md)
- [개인정보 보호 샌드박스 자세히 알아보기](https://web.dev/digging-into-the-privacy-sandbox)
