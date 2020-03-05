const resumeProjects = [
  {
    projectname: "Cashmi - Android Application",
    link:
      "https://play.google.com/store/apps/details?id=com.application.cashmi",
    tech: "Android, Java, Firebase, Facebook SDK",
    points: [
      "Provides users with an easy way to split bills/transactions with other users",
      "Uses Firebase to store User and Transaction information and interactions, and Facebook SDK to sign in users",
      "Makes use of Recylerview and Listview to shuffle through data contained in adapters"
    ]
  },
  {
    projectname: "Image Tagger",
    link: "https://github.com/PiyushDatta/Image_tagger",
    tech: "Java, JavaFX",
    points: [
      "Simple to use GUI that allows users to put self-generated tags on images",
      "Uses a Model-View-Controller design to provide maintainability between the components and the GUI",
      "Code is Serializable and therefore maintains a record of tagged images, modified images, and modified tags"
    ]
  },
  {
    projectname: "SEC Edgar File Downloader",
    link: "https://github.com/PiyushDatta/SEC_file_downloader",
    tech: "Python, Tkinter, SQlite, Pandas, BeautifulSoup",
    points: [
      "Only open-source GUI to download SEC Edgar public filings from SEC website directly",
      "Optimized code with web scraping to remove the project’s dependency of a SQL database",
      "Code is Serializable and therefore maintains a record of user settings and user’s choice of directory"
    ]
  },
  {
    projectname: "Two Sigma - AI Competition - Halite 2",
    link: "https://halite.io/",
    tech: "Python, Tensorflow, Numpy",
    points: [
      "Used artificial intelligence (feed forward) to train and teach my bot to beat other bots in a virtual game created by Two Sigma (Ranked top 10% of players in Halite 2, current website shows stats for Halite 3 which is ongoing)",
      "Scraped data from google cloud buckets and trained my bot on google cloud virtual machines."
    ]
  },
  {
    projectname: "Monte Carlo Pi Approximation Simulation",
    link: "https://github.com/PiyushDatta/Monte-Carlo-approximation-of-Pi",
    tech: "Python, Django, Angular, Typescript, PostgreSQL",
    points: [
      "Uses a circle and square to demonstrate the approximation of pi using the Monte Carlo method",
      "Created a Django REST API backend that stored x and y points in a PostgreSQL, and a command to populate SQL",
      "Created an Angular frontend using Typescript and HTML/CSS that called this REST API",
      "Uploaded project on the cloud (Heroku) where frontend and backend were uploaded to two different websites"
    ]
  },
  {
    projectname: "Other",
    link: "",
    tech: "",
    points: [
      "Friendli (Android Application/Google API/Yelp API/Firebase/Facebook SDK)",
      "Weather App (Node Js/Express/Openweathermap API)",
      "Craigslist Scraper (Django/Python Web Application/Heroku/BeautifulSoup4)",
      "Personal Website (Node Js/React/React-Router/Express/Webpack)",
    ]
  }
];

export default resumeProjects;
