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
			"A second-year graduate student at The University of Texas at Austin pursuing a Master's in Mechanical Engineering, with a passion for robotics.",
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
			title: "ARISTO Hand",
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
				"Use ARISTO Hand has data collection platform for imitation learning in robotic manipulation tasks and deployed policies on ARISTO Hand",
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
			title: "Human Centered Robotics Lab: Ungraduate Research",
			slug: "hcrl-ugrad-research",
			description:
				"Undergraduate research on humanoids and assistive robotics at the Human Centered Robotics Lab.",
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
			title: "Human-Enabled Robotics Technology Lab",
			slug: "sas",
			description:
				"Undergraduate research at the Human-Enabled Robotics Technology Lab.",
			logo: "./mouse.png",
			longMarkupKey: "hero",
			category: "research",
		},

		{
			title: "Freshman Research Initiative",
			slug: "sas",
			description:
				"Freshman Research initiative.",
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
};

export default INFO;
