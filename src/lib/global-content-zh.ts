import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "以上金额仅供参考，出发前请以官方渠道信息为准。";

export const ZH_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "使用方法",
  title: "从一个想法，到一份看得懂的行程报价，只需三步。",
  intro:
    "只要填写出发地和目的地，AutoVere 就能把一趟跨国自驾之旅的花费——过路费、电子通行凭证、燃油、充电、渡轮——按车型清晰地算给你看，无论是轿车、房车还是长途摩托车。",
  sections: [
    {
      heading: "1 — 告诉我们这趟旅程",
      body: "填写出发地和目的地，选择车型和燃料或能源类型，再按需勾选偏好——比如优先风景路线、避开收费路段，或者要不要走渡轮。",
      items: [
        "轿车、房车/露营车、长途摩托车三种档案任选",
        "汽油、柴油或电动（EV）——油箱容量、电池信息和油耗数据都可以按自己的车填",
        "支持 AutoPASS、Telepass、Bip&Go、SunPass、E-ZPass 等各地电子标签系统",
      ],
    },
    {
      heading: "2 — 每一公里，我们都认真算过",
      body: "沿途经过的每个国家或州都会单独计费，各自采用当地实际的收费方式——电子通行凭证、按里程计费、市区过路费，或者干脆是免费高速——再叠加当地的燃油和快充价格。",
      items: [
        "逐国给出过路费和电子通行凭证明细，标明每一处收费点",
        "如果沿途有摩托车专属优惠，会自动帮你算上",
        "渡轮票价和山口过路费单独列出，一目了然",
        "智能燃油/充电规划，始终为续航留出 75% 的安全余量",
      ],
    },
    {
      heading: "3 — 剩下的，就是上路了",
      body: "可以导出 GPX 文件给车载导航用，把行程存进「我的车库」，也可以直接分享给同行的伙伴。每一笔过路费都链接到官方购买渠道，过境前就能提前办好。",
      links: [
        { label: "ASFINAG（奥地利）", url: "https://www.asfinag.at/" },
        { label: "AutoPASS（挪威）", url: "https://www.autopass.no/" },
        { label: "Telepass（意大利）", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "AutoVere 使用方法 — 跨国自驾费用一目了然",
    description: "了解 AutoVere 如何按国家/地区计算过路费、电子通行凭证、燃油、EV 充电和渡轮费用，覆盖轿车、房车与长途摩托车。",
  },
};

export const ZH_PRICING: InfoPageContent = {
  eyebrow: "价格方案",
  title: "先免费规划，行程认真了再升级也不迟。",
  intro: "日常的行程规划完全免费。付费方案是为那些要在车上生活好几周、需要更细致路线规划、离线导出和无限保存的旅行者准备的。",
  sections: [
    {
      heading: "Explorer — 免费",
      body: "无论是周末短途还是跨两国的小旅行，这个方案都够用了。",
      items: [
        "欧洲、美国、加拿大范围内的行程试算次数不限",
        "按国家/州给出过路费、电子通行凭证和渡轮费明细",
        "燃油与 EV 充电估算，附官方渠道链接",
        "「我的车库」最多可保存 3 辆车、5 条行程",
      ],
    },
    {
      heading: "Voyager — 每月 4.90 欧元",
      body: "适合漫长的夏季自驾、峡湾之旅，或是横跨海岸线的长途旅行。",
      items: [
        "保存车辆和行程数量不设上限",
        "导出 GPX 文件，标注过路费和充电站点位",
        "智能省油建议，长途区间会提前提醒加油/充电",
        "过路费或电子通行凭证价格调整时，优先收到通知",
      ],
    },
    {
      heading: "Fleet & Partners — 每月 29 欧元起",
      body: "面向租车公司、房车经销商、骑行俱乐部和旅行社。",
      items: [
        "支持团队共用的多车辆档案与共享行程",
        "可直接交给客户使用的定制品牌行程单",
        "费用试算 API 接入（目前为内测阶段）",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "价格方案 — 免费规划行程，Voyager 方案可选升级 | AutoVere",
    description: "AutoVere 的日常行程规划完全免费；Voyager 与 Fleet 方案提供无限保存、GPX 导出和企业合作功能。",
  },
};

export const ZH_FAQ: InfoPageContent = {
  eyebrow: "常见问题",
  title: "出发前，旅行者们最常问我们的问题。",
  intro: "关于费用估算是怎么算出来的、数据从哪里来，以及哪些事还得你自己动手办——我们直接说清楚。",
  sections: [
    {
      heading: "费用估算准确吗？",
      body: "我们参照各地公开的过路费和电子通行凭证价格，以及区域平均燃油、充电价格来计算。实际费用会受燃油市场波动、季节性调价、分时段计费和车型规则等因素影响，因此请把这些数字当作可靠的参考，出发前务必在官方渠道确认最终价格。",
    },
    {
      heading: "你们会代卖电子通行凭证或通行证吗？",
      body: "不会，这是我们刻意坚持的原则。每一笔过路费都直接链接到官方运营方——ASFINAG、via.admin.ch、AutoPASS、Telepass、407 ETR、SunPass 等——你付的始终是官方原价，没有任何加价。",
    },
    {
      heading: "摩托车怎么计费？",
      body: "长途摩托车会作为独立车型单独计算。如果某段路有摩托车专属优惠，我们会自动帮你估算折扣；挪威市区过路费对两轮车型免收；山口路段还会提供骑行者专属的安全提示和装备建议。",
    },
    {
      heading: "房车或露营车呢？",
      body: "涉及重量和轴数限制的路段，我们会按对应规则计费，隧道、山口和低净空桥梁等路段也会提前标出高度、长度、重量方面的限制提醒。",
    },
    {
      heading: "支持电动车吗？",
      body: "支持。选择「电动（EV）」车型，填写电池容量和电耗数据即可。我们会以 75% 续航作为安全余量来规划快充站点，并展示沿途会用到的充电网络，例如 Ionity、Fastned、Tesla Supercharger、Electrify America、FLO。",
    },
    {
      heading: "需要注册账号吗？",
      body: "不需要。不注册也能规划和导出行程。「我的车库」里的车辆和行程数据保存在你自己的浏览器里，除非你主动分享，否则不会离开你的设备。",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "常见问题 — 过路费、电子通行凭证、燃油与 EV 充电 | AutoVere",
    description: "了解费用估算的准确度、官方过路费渠道、摩托车与房车计费规则、EV 充电规划，以及账号相关问题。",
  },
};

export const ZH_PARTNERS: InfoPageContent = {
  eyebrow: "合作伙伴",
  title: "与守护每一段路的人同行。",
  intro: "AutoVere 直接链接官方过路费运营方，也与欧洲、美国和加拿大各地的旅行、租车与骑行相关企业保持合作。",
  sections: [
    {
      heading: "我们链接的官方过路费与电子通行凭证运营方",
      body: "所有付款都在运营方自己的官网完成，AutoVere 从不代为收费。",
      links: [
        { label: "ASFINAG — 奥地利", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — 瑞士", url: "https://via.admin.ch/" },
        { label: "AutoPASS — 挪威", url: "https://www.autopass.no/" },
        { label: "Telepass — 意大利", url: "https://www.telepass.com/" },
        { label: "DARS — 斯洛文尼亚", url: "https://www.dars.si/" },
        { label: "407 ETR — 安大略省", url: "https://www.407etr.com/" },
        { label: "SunPass — 佛罗里达州", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "与我们合作的伙伴",
      items: [
        "希望为客户提供透明报价的房车/露营车租赁企业",
        "策划阿尔卑斯山或峡湾路线的摩托车旅行社与骑行俱乐部",
        "EV 充电网络及路线规划类应用",
        "希望推广风景公路、海岸线与渡轮航线的旅游局",
      ],
    },
    {
      heading: "商务合作",
      body: "KM TECH LABS 总部位于挪威克里斯蒂安桑。如果你所在的企业经营租车、旅行社或过路费相关业务，希望探讨系统对接、联合推广或数据合作，欢迎发邮件到 partners@autovere.com 与我们联系。",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "合作伙伴 — 官方过路费运营方与旅行业务合作 | AutoVere",
    description: "AutoVere 直接链接官方过路费与电子通行凭证运营方，并与租车企业、旅行社和充电网络展开合作。",
  },
};

export const ZH_PRIVACY: InfoPageContent = {
  eyebrow: "隐私政策",
  title: "你的行程，只属于你自己。",
  intro: "AutoVere 由挪威克里斯蒂安桑的 KM TECH LABS 运营。我们只收集为你提供准确费用估算所必需的最少信息。",
  sections: [
    {
      heading: "我们会存储的信息",
      items: [
        "用于生成估算结果的行程信息（出发地、目的地、车辆及偏好设置）",
        "保存的车辆与行程——存储在你自己的浏览器本地，不会上传至我们的服务器",
        "经过匿名汇总、无法识别个人身份的使用统计数据，用于改进产品",
      ],
    },
    {
      heading: "我们不会做的事",
      items: ["不出售或出租个人数据", "不追踪你的实时位置信息", "规划、导出或分享行程均无需注册账号"],
    },
    {
      heading: "你在 GDPR 下享有的权利",
      body: "作为一家总部位于挪威/欧洲经济区的运营方，我们遵循《通用数据保护条例》（GDPR）。你可以申请查阅、更正、删除、限制处理、数据可携带，或对数据处理提出异议。清除浏览器本地存储后，已保存的车辆和行程信息会立即被删除。",
    },
    {
      heading: "Cookie 与数据分析",
      body: "我们仅使用必要的本地存储来记住你的地区、语言和车库信息。所进行的任何数据分析都是经过汇总处理的，无法识别到具体个人。",
    },
    {
      heading: "联系方式",
      body: "隐私相关问题请联系 privacy@autovere.com（KM TECH LABS，挪威克里斯蒂安桑）。分地区说明：美国地区的隐私条款见 /us/legal，加拿大 PIPEDA 及魁北克省 25 号法案相关权利见 /ca/legal。",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "隐私政策 — GDPR、本地存储与你的数据 | AutoVere",
    description: "了解 KM TECH LABS 如何处理行程输入信息、本地保存的车库数据、Cookie 使用，以及你在 GDPR 下享有的权利。",
  },
};

export const ZH_TERMS: InfoPageContent = {
  eyebrow: "服务条款",
  title: "条款清晰明确，规划才能安心。",
  intro: "使用 AutoVere 即表示你同意以下条款。这些条款的目的，是诚实地说明费用估算究竟是什么——以及它不是什么。",
  sections: [
    {
      heading: "这是估算，不是账单",
      body: "页面上显示的所有费用均为参考估算，基于公开的收费标准和区域平均价格计算得出。实际的过路费、电子通行凭证、燃油、充电和渡轮票价可能因车型、季节、时段及运营方政策调整而有所不同。出发前请务必以官方渠道信息为准。",
    },
    {
      heading: "安全、合法使用",
      items: [
        "请勿在驾驶过程中使用 AutoVere——请在出发前完成行程规划",
        "请遵守当地交通法规、车型分类规定，以及通行、山口或隧道的相关限制",
        "不允许进行自动化抓取、转售我们的输出结果，或将其伪装成官方报价",
      ],
    },
    {
      heading: "第三方链接与服务",
      body: "页面中过路费运营方、渡轮公司和充电网络的链接仅为方便用户使用而提供。这些服务各自有自己的条款和价格，KM TECH LABS 不对其内容或交易承担责任。",
    },
    {
      heading: "责任限制",
      body: "AutoVere 按「现状」提供服务。在法律允许的范围内，KM TECH LABS 不对因依赖本估算而产生的费用、罚款、错过通行时段或其他损失承担责任。",
    },
    {
      heading: "适用法律",
      body: "本条款适用挪威法律，并以克里斯蒂安桑为约定管辖地，但不影响你所在国家/地区法律规定的强制性消费者保护权利。",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "服务条款 — 估算免责声明与合理使用规范 | AutoVere",
    description: "AutoVere 由 KM TECH LABS 提供的服务条款：参考估算说明、安全使用规范、第三方链接、责任限制及适用法律。",
  },
};
