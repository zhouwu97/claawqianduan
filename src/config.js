const defaults = {
  name: "纯合子",
  metaData: {
    title: "纯合子的个人主页",
    description: "普通学生，时不时写点简单算法题。大社恐，偶尔折腾点小东西。",
  },
  hero: {
    intro: "普通学生，时不时写点简单算法题。",
    description: "大社恐，偶尔折腾点感兴趣的小东西。",
  },
  tags: ["普通学生", "简单算法题", "大社恐", "二次元", "听歌"],
  musicPlayer: {
    server: "netease",
    type: "playlist",
    id: "2028178887",
    source: "shared",
    api: "",
  },
};

export function mergeConfig(overrides = {}) {
  if (!overrides || typeof overrides !== "object" || Array.isArray(overrides))
    return defaults;
  return {
    ...defaults,
    ...overrides,
    metaData: { ...defaults.metaData, ...overrides.metaData },
    hero: { ...defaults.hero, ...overrides.hero },
    musicPlayer: { ...defaults.musicPlayer, ...overrides.musicPlayer },
    tags: Array.isArray(overrides.tags)
      ? overrides.tags.filter((tag) => typeof tag === "string")
      : defaults.tags,
  };
}

let overrides = {};
try {
  overrides = JSON.parse(import.meta.env?.VITE_CONFIG || "{}");
} catch {}
export const site = mergeConfig(overrides);
export default site;
