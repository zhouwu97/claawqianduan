const config = {
	metaData: {
		title: '周周的个人主页✨',
		description: '欢迎来到周周的奇妙世界！',
		keywords: '周周,个人主页,个人网站',
		icon: '/favicon.ico'
	},

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

	projectcards: [
		{ go: "🏠 前往", img: "/img/illust_132964987_20260420_102507.jpg", title: "洛谷", subtitle: "刷题记录", text: "算法竞赛题目练习与题解。", url: "https://www.luogu.com.cn/user/1993718", show: false },
		{ go: "💎 前往", img: "/img/illust_132964987_20260420_102509.jpg", title: "宝藏网站", subtitle: "实用工具 & 资源导航", text: "发现互联网上的宝藏资源。", url: "https://github.com/zhouwu97", show: false },
		{ go: "🎵 前往", img: "/img/illust_132964987_20260420_102511(1).jpg", title: "歌单分享", subtitle: "self 能来个腐竹吗", text: "网易云音乐歌单分享", url: "https://music.163.com/m/playlist?id=12440761642&creatorId=4940956665", show: false },
		{ go: "🎮 前往", img: "/img/illust_132964987_20260420_102513.jpg", title: "游戏记录", subtitle: "Steam & Switch", text: "通关记录和游戏心得分享。", url: "https://github.com/zhouwu97", show: false },
		{ go: "🤲 求求了", img: "/img/illust_132964987_20260420_102514.jpg", title: "赛博要饭", subtitle: "求求大家注册", text: "求求大家注册并且实名一下吧！", url: "https://cloud.siliconflow.cn/i/gNjt9kwg", show: false },
	],

	statement: ["© 2025 周周 | All Rights Reserved"],
}

export default config
