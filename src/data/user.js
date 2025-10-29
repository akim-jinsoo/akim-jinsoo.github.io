const INFO = {
	main: {
		title: "Online Portfolio",
		name: "Aaron Kim",
		email: "akim2002@utexas.edu",
 		logo: "../logo.png", //TODO change logo to my logo
		universityLogo: "../ut-logo.png",
	},

	socials: {
		github: "https://github.com/akim-jinsoo",
		linkedin: "https://www.linkedin.com/in/akim-jinsoo/",
	},

	homepage: {
		title: "Hello! I'm Aaron",
		description:
			"A Graduate student in Mechanical Engineering at UT Austin, specializing in mechanical design, robotic manipulation, and machine learning.",
	},

	// About section (editable content for the homepage About card)
	about: {
		paragraphs: [
			"I’m pursuing an integrated master’s degree in Mechanical Engineering at The University of Texas at Austin, specializing in dynamic systems and control. My research experience comes primarily from working with Dr. Luis Sentis at the Human-Centered Robotics Lab, where I focus on robotic manipulation and learning-based control.",
			"My passion for robotics drives me to design, build, and test systems that bridge mechanical design, control theory, and machine intelligence. This portfolio highlights a range of projects that reflect my hands-on approach to solving complex robotics problems.",
			"Outside of engineering, I enjoy photography, cooking, traveling, and spending time in the garage as a self-taught mechanic.",
			"Feel free to reach out via LinkedIn or email; I’m always open to connecting about research or industry collaborations."
		],
	},

	education: [
		{
			degree: "M.S. in Mechanical Engineering",
			institution: "The University of Texas at Austin",
			period: "August 2024 - May 2026",
			gpa: "3.7/4.0",
			description: "Relevant Coursework: Sensor-based algorithms, Robot Manipulation Learning, Learning for dynamics and control",
			awards: [
				"Award: NSF Research Traineeship Recipient"
			],
		},
		{
			degree: "B.S. in Mechanical Engineering",
			institution: "The University of Texas at Austin",
			period: "August 2020 - May 2024",
			gpa: "3.6/4.0",
			description: "Relevant Coursework: Design of Human-centered Robotics, Robot Mechanism Design, Mechatronics, Dynamics Systems & Control",
		},
	],


	projects: [
		{
			title: "ARISTO Hand (in-progress)",
			slug: "aristo",
			description:
				"3 Fingered Robotics Hand achieving human-like sensing.",
			logo: "./aristo.png",
			longMarkupKey: "aristo",
			category: "research",
		},

		{
			title: "PLATO Hand",
			slug: "plato",
			description:
				"3 Fingered Robotics Hand inspired by human musculoskeletal autonomy.",
			logo: "./plato.png",
			longMarkupPath: "/projects/plato.txt",
			longMarkupKey: "plato",
			category: "research",
		},

		{
			title: "Isaac Lab: Reinforcement Learning for Robotic Manipulation",
			slug: "reinforcement-learning",
			description:
				"Utilizing Isaac Lab for simulating and training PLATO/ARISTO Hand for manipulation tasks.",
			logo: "./rl.gif",
			longMarkupKey: "rl",
			category: "research",
		},

		{
			title: "Imitation Learning for Robotic Manipulation",
			slug: "imitation-learning",
			description:
				"Utilizing ARISTO Hand has data collection platform for imitation learning in robotic manipulation tasks and deployed policies on ARISTO Hand",
			// logo: "https://cdn.jsdelivr.net/npm/programming-languages-logos/src/javascript/javascript.png",
			longMarkupKey: "il",
			longDescription: "!!!This page is under construction!!! Please check back later for updates.",
			category: "research",
		},

		{
			title: "Sony: Robotic Hand",
			slug: "sony-robotic-hand",
			description:
				"Developed and tested actuators and 3-finger robotic hand at the Fundamental Robotics Lab in Sony, Tokyo, Japan.",
			logo: "./hand.png",
			longMarkupKey: "sony",
			category: "internship",
		},

		{
			title: "Human Centered Robotics Lab: Undergraduate Research",
			slug: "hcrl-ugrad-research",
			description:
				"Undergraduate researcher on humanoids and assistive robotics at the Human Centered Robotics Lab.",
			logo: "./draco.png",
			longMarkupKey: "hcrl",
			category: "research",
		},

		{
			title: "Samsung Austin Semiconductor",
			slug: "sas",
			description:
				"Internship at Samsung Austin Semiconductor.",
			logo: "./fab.png",
			longMarkupKey: "samsung",
			category: "internship",
		},

		{
			title: "Human-Enabled Robotics Technology Lab: Haptic Mouse Device",
			slug: "hero",
			description:
				"An autonomous multi-channel system that automates tactile sensitivity testing in mice to support neurological pain research.",
			logo: "./mouse.png",
			longMarkupKey: "hero",
			category: "research",
		},


		{
			title: "Freshman Introduction to Research in Engineering",
			slug: "fri",
			description:
				"Developed and lead a rehabilitation device for children with traumatic brain injuries.",
			logo: "./fire.png",
			longMarkupKey: "fire",
			category: "research",
		},

		{
			title: "Hockey Bot",
			slug: "hockey-bot",
			description:
				"ME 392Q",
			logo: "./hockey.png",
			longMarkupKey: "hockey",
			category: "course",
		},

		{
			title: "Battle Bot",
			slug: "battle-bot",
			description:
				"ME 366J",
			logo: "./battle.png",
			longMarkupKey: "battle",
			category: "course",
		},

		{
			title: "RC Car",
			slug: "rc-car",
			description:
				"ME 388",
			logo: "./car.png",
			longMarkupKey: "car",
			category: "course",
		},

	],

	// Publications: add/remove entries here to show on the Publications page
	publications: [
		{
			id: "paper-1",
			title: "PLATO Hand: Dexterous Robotic Hand with Fingernails for Versatile Force Interaction",
			authors: "Dong Ho Kang, Aaron Kim, Mingyo Seo, & Luis Sentis",
			venue: "IEEE Robotics and Automation Letters (under review)",
			year: 2025,
			abstract:
				"We present a robotic hand design that uses artificial fingernails and proprioceptive five-bar linkage fingers to achieve both precise and dynamic manipulation in unstructured environments.",
		},

		// examples of links
			// link: "https://github.com",

			// link: ["https://github.com", "PDF"],
		
			// links: [
			// { href: "https://github.com", label: "PDF" },
			// { href: "https://arxiv.org/abs/...", label: "arXiv" }
			// ],

	],
};

export default INFO;
