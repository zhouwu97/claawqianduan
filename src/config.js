const config = {
	metaData: {
		title: '周周的个人主页✨',
		description: '欢迎来到周周的奇妙世界！',
		keywords: '周周,个人主页,个人网站',
		icon: '/favicon.ico'
	},

	avatar: "/img/avatar.jpg",
	welcometitle: "Hi, I'm 周周",

	color: {
		themecolor: "#FFF0F5",
		welcometitlecolor: "#FF89B5",
		turntablecolor1: "#FFB6C1",
		turntablecolor2: "#DDA0DD"
	},

	brightness: 85,
	blur: 5,

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

	socialPlatformIcons: [
		{ icon: "mdi-home", link: "https://zhouwu.ccwu.cc" },
		{ icon: "mdi-github", link: "https://github.com/zhouwu97" },
		{ icon: "mdi-qqchat", link: "https://qm.qq.com/cgi-bin/qm/qr?k=" },
		{ icon: "mdi-account-school", link: "https://www.luogu.com.cn/user/1993718" },
		{ icon: "mdi-cloud", link: "https://chunhezi.pages.dev" },
		{ icon: "mdi-email", link: "mailto:3170305904@qq.com" }
	],

	typeWriterStrings: [
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

	projectcards: [
		{ go: "🏠 前往", img: "/img/bg-pc.png", title: "个人主页", subtitle: "zhouwu.ccwu.cc", text: "周周的个人主页域名~", url: "https://zhouwu.ccwu.cc", show: false },
		{ go: "💻 前往", img: "/img/bg-pc.png", title: "GitHub", subtitle: "zhouwu97", text: "代码仓库与开源项目。", url: "https://github.com/zhouwu97", show: false },
		{ go: "🏅 前往", img: "/img/bg-pc.png", title: "洛谷", subtitle: "刷题记录", text: "算法竞赛题目练习与题解。", url: "https://www.luogu.com.cn/user/1993718", show: false },
		{ go: "☁️ 前往", img: "/img/bg-pc.png", title: "Cloudflare Pages", subtitle: "chunhezi", text: "在 CF Pages 上部署的项目~", url: "https://chunhezi.pages.dev", show: false },
		{ go: "📝 前往", img: "/img/bg-pc.png", title: "前端练手", subtitle: "Vue & React", text: "各种前端小项目集合，持续更新中~", url: "https://github.com/zhouwu97", show: false },
		{ go: "🎮 前往", img: "/img/bg-pc.png", title: "游戏记录", subtitle: "Steam & Switch", text: "通关记录和游戏心得分享。", url: "https://github.com/zhouwu97", show: false },
		{ go: "📚 前往", img: "/img/bg-pc.png", title: "读书笔记", subtitle: "轻小说 & 技术书", text: "阅读是灵魂的避难所。", url: "https://github.com/zhouwu97", show: false },
		{ go: "🎵 前往", img: "/img/bg-pc.png", title: "歌单分享", subtitle: "ACG音乐推荐", text: "耳机里的世界，是另一个次元。", url: "https://github.com/zhouwu97", show: false },
	],

	statement: ["© 2025 周周 | All Rights Reserved"],
}

export default config
