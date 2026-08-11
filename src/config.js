const config = {
	metaData: {
		title: '周周的个人主页✨',
		description: '欢迎来到周周的奇妙世界！',
		keywords: '周周,个人主页,个人网站',
		icon: '/favicon.ico'
	},

	name: '周周',
	avatar: "/img/touxiang.jpg",
	welcometitle: "Hi, I'm 周周",

	color: {
		themecolor: "#FFF0F5",
		welcometitlecolor: "#FF89B5",
		turntablecolor1: "#FFB6C1",
		turntablecolor2: "#DDA0DD"
	},

	brightness: 85,
	blur: 5,

	// Hero 区域文案（桌面端工作台）
	hero: {
		intro: '欢迎来到我的小世界。',
		description: '写代码、刷题、做项目，也会追番、听歌和收集一些奇奇怪怪的网站。这里不需要把所有东西都做成卡片——只留下真正想让你看到的部分。',
		status: '大概率还没睡',
		quote: '生活不止眼前的代码，还有远方的番剧和奶茶。',
		location: 'Shenyang',
	},

	tags: ['二次元', '猫奴', '夜猫子', '甜食控', '社恐', '追番达人', '游戏宅', '治愈系'],

	background: {
		"pc": {
			"type": "pic",
			"datainfo": {
				"title": "默认PC壁纸",
				"preview": "/img/bg-pc.png",
				"url": "/img/bg-pc.png"
			},
		},
		"mobile": {
			"type": "pic",
			"datainfo": {
				"title": "默认手机壁纸",
				"preview": "/img/bg-mobile.png",
				"url": "/img/bg-mobile.png"
			}
		}
	},

	polarChart: {
		skills: ['Vue.js', 'React', 'JavaScript', 'TypeScript', 'Node', 'Python', 'CSS', 'Figma', 'Git', 'Docker', 'Linux'],
		skillPoints: [80, 72, 85, 75, 78, 68, 88, 65, 82, 60, 70],
	},

	// 技术栈（新，取代雷达图首页展示；未配置时回退到 polarChart 前 6 项）
	skills: {
		list: [
			{ name: 'JavaScript', value: 85 },
			{ name: 'CSS / UI', value: 88 },
			{ name: 'Vue.js', value: 80 },
			{ name: 'TypeScript', value: 75 },
			{ name: 'Node', value: 78 },
		],
	},

	// 最近在做（新）
	now: [
		{
			icon: 'M8 6h8M6 10h12M6 14h8M6 18h5',
			title: '沈理校园 SYLUlive',
			subtitle: '校园应用 · Flutter + Go',
			status: 'Active',
		},
		{
			icon: 'm6 16 4-8 4 8 4-8',
			title: '算法练习',
			subtitle: 'NowCoder · AtCoder · Luogu',
			status: 'Daily',
		},
	],

	socialPlatformIcons: [
		{ icon: "mdi-home", link: "https://zhouwu.ccwu.cc" },
		{ icon: "mdi-github", link: "https://github.com/zhouwu97" },
		{ icon: "mdi-qqchat", link: "https://qm.qq.com/cgi-bin/qm/qr?k=" },
		{ icon: "mdi-account-school", link: "https://www.luogu.com.cn/user/1993718" },
		{ icon: "mdi-email", link: "mailto:wu22402@gmail.com" }
	],

	typeWriterStrings: [
		"连基本的网络都搞不，仗着自己是运营商的人就能否定基本的网络知识了吗？",
		"欢迎来到周周的小世界~ 🎀",
		"今天的天气真好，适合摸鱼（划掉）适合写代码！",
		"生活不止眼前的代码，还有远方的番剧和奶茶。",
		"做自己喜欢的事情，过自己想要的生活。"
	],

	musicPlayer: {
		server: 'netease',
		type: 'playlist',
		id: '2028178887'
	},

	wallpaper: {
		pic: [
			{ "title": "默认壁纸", "preview": "/img/bg-pc.png", "url": "/img/bg-pc.png" },
		],
		picMobile: [
			{ "title": "默认手机壁纸", "preview": "/img/bg-mobile.png", "url": "/img/bg-mobile.png" },
		],
		video: [],
		videoMobile: [],
	},

	treasurewebs: [
		{
			name: "沈理校园 SYLUlive",
			desc: "校园互助社交应用 - 发现身边有趣的人与事",
			url: "https://github.com/zhouwu97/SYLUlive",
			icon: "mdi-school",
			color: "#FF69B4"
		},
		{
			name: "洛谷 Luogu",
			desc: "算法竞赛题目练习与题解 - 程序员的练兵场",
			url: "https://www.luogu.com.cn/",
			icon: "mdi-sword",
			color: "#00BFFF"
		},
		{
			name: "SmallPDF",
			desc: "免费在线PDF工具箱 - PDF转JPG、压缩PDF、编辑PDF",
			url: "https://smallpdf.com/cn/pdf-to-jpg",
			icon: "mdi-file-pdf-box",
			color: "#FF6B6B"
		},
		{
			name: "LeetCode",
			desc: "面试算法练习平台 - 对症下药攻克面试难题",
			url: "https://leetcode.cn/",
			icon: "mdi-code-braces",
			color: "#FFD93D"
		},
		{
			name: "The Pirate Bay",
			desc: "海盗湾 - 银河系最强大的BitTorrent网站",
			url: "https://thepiratebay.org/",
			icon: "mdi-pirate",
			color: "#6BCB77"
		},
	],

	// 新项目结构：featured / tags / status
	projects: [
		{
			id: 'luogu',
			title: '洛谷 · 刷题记录',
			subtitle: 'Algorithm practice / Luogu',
			description: '算法竞赛题目练习与题解。',
			img: "/img/illust_132964987_20260420_102507.jpg",
			url: "https://www.luogu.com.cn/user/1993718",
			featured: true,
			tags: ['算法', '题解'],
			status: 'Pinned',
		},
		{
			id: 'treasure',
			title: '宝藏网站',
			subtitle: '实用工具 & 资源导航',
			description: '发现互联网上的宝藏资源。',
			img: "/img/illust_132964987_20260420_102509.jpg",
			url: "treasure",
			featured: false,
			tags: ['工具', '资源'],
			status: '',
		},
		{
			id: 'playlist',
			title: '歌单分享',
			subtitle: 'NetEase Music',
			description: '网易云音乐歌单分享',
			img: "/img/illust_132964987_20260420_102511(1).jpg",
			url: "https://music.163.com/m/playlist?id=12440761642&creatorId=4940956665",
			featured: false,
			tags: ['音乐'],
			status: '',
		},
		{
			id: 'sylulive',
			title: '沈理校园 · SYLUlive',
			subtitle: 'Flutter / Go / PostgreSQL',
			description: '校园课表、成绩、二课、社区、二手市场……',
			img: "/img/illust_132964987_20260420_102513.jpg",
			url: "https://github.com/zhouwu97/SYLUlive",
			featured: true,
			tags: ['Flutter', 'Go', 'PostgreSQL'],
			status: 'Building',
		},
	],

	// 旧字段保留兼容
	projectcards: [
		{ go: "🏠 前往", img: "/img/illust_132964987_20260420_102507.jpg", title: "洛谷", subtitle: "刷题记录", text: "算法竞赛题目练习与题解。", url: "https://www.luogu.com.cn/user/1993718", show: false },
		{ go: "💎 前往", img: "/img/illust_132964987_20260420_102509.jpg", title: "宝藏网站", subtitle: "实用工具 & 资源导航", text: "发现互联网上的宝藏资源。", url: "treasure", show: false },
		{ go: "🎵 前往", img: "/img/illust_132964987_20260420_102511(1).jpg", title: "歌单分享", subtitle: "self 能来个腐竹吗", text: "网易云音乐歌单分享", url: "https://music.163.com/m/playlist?id=12440761642&creatorId=4940956665", show: false },
		{ go: "🎮 前往", img: "/img/illust_132964987_20260420_102513.jpg", title: "游戏记录", subtitle: "Steam & Switch", text: "通关记录和游戏心得分享。", url: "https://github.com/zhouwu97", show: false },
		{ go: "🤲 求求了", img: "/img/illust_132964987_20260420_102514.jpg", title: "赛博要饭", subtitle: "求求大家注册", text: "求求大家注册并且实名一下吧！", url: "https://cloud.siliconflow.cn/i/gNjt9kwg", show: false },
	],

	statement: ["© 2025 周周 | All Rights Reserved"],
}

export default config
