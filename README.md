
# GULP STARTER-KIT

**GULP STARTER-KIT** is a tool that we designed to make it easier for developers (especially Front-end Developers) to create and create user interfaces as outlined in the visual web form of the design that has been determined.


## Features

This **WEB UIKIT** provides a simple way of setting up a modern web development environment. Here is a list of the current features:

-  [**rollup.js**](https://rollupjs.org/guide/en/) a module bundler for JavaScript
-  [**GULP 4**](https://gulpjs.com/) Automate and enhance your workflow.
-  [**Nunjucks**](https://mozilla.github.io/nunjucks/) A rich and powerful templating language for JavaScript.
-  [**ES2015 Babel**](https://babeljs.io/) transpiler that allows you writing JS Code in ES2015/ES6 style.
-  [**Sass**](http://sass-lang.com/): CSS pre-processor with [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer).
-  [**Browsersync**](https://browsersync.io/) with Live reload.
-  Minifies and optimize your javascript.


## Requirements

This should be installed on your computer in order to get up and running:

-  [**Node.js**](https://nodejs.org/en/) Required node version is >= `10.0`
-  **npm** Version `6.0.*`

> If you've previously installed gulp globally, run `npm rm --global` gulp before following these instructions.



## Usage

As a prerequisite it's assumed you have `npm` or `yarn` installed.



1.  **Clone Repo**

	Make sure you have a **GULP STARTER-KIT** clone repository.
	```
	git@github.com:alaunal/gulp-starter-kit.git
	```
	after you clone you will get structure directory like this :


	```
		[gulp-starter-kit]
			├── src/
			├── .gitignore
			├── gulpfile.js
			├── gulp.config.js
			├── data.config.json
			├── .editorconfig
			├── .babelrc
			├── .jshintrc
			├── .jsbeautifyrc
			├── package.json
			├── path.config.dump
			├── rollup.config.js
			├── site.config.js
			├── README.md
	```

2.  **Gulp Setup**

	you just execute this script `npm install --global gulp-cli`, and make sure your Gulp CLI is currently in the version `2.0.*`

3.  **Install dependencies**

	```
	$ npm install
	```

	```
	$ npm install --global rollup
	```

	> if you have done the syntax above before, there is no need to do a step 3 process. but if you are not sure then just do it for check updated.

4.  **Serve or deploy**

	When we start the `serve` process, the task runner below has `env` **development** and automatically `watch` the changes you make to the code.

	```
	$ yarn serve
	```

	or

	```
	$ npm run serve
	```


	> We have two environment build tasks in the development process or for deployment production.



	**Development Build**

	- development watch --> `yarn watch` or `npm run watch`
	- development compile --> `yarn dev` or `npm run dev`

	**Production Build**

	- Production compile --> `yarn build` or `npm run build`

5.  **Static Merging**

	if you want the results of the static compile to be used in another directory or project, we provide a few easy steps to copy all files and directories that are in the `static` directory to the directory that you want to paste.

	- duplicate the `path.config.dump` file and rename it to `path.config.js`
	- open the `path.config.js` file, then you can adjust the directory destination you want to paste by filling in the `path` in the` DIR_TOCOPY` variable.
	- untuk proses penggabungan direktori static, anda dapat menggunakan run script:
		```
		$ npm run merge-dev
		```
		or
		```
		$ yarn merge-dev
		```

		for production `env`

		```
		$ yarn merge-build
		```
		or
		```
		$ npm run merge-build
		```
