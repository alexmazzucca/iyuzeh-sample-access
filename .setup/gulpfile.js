/*
* >>========================================>
* Required
* >>========================================>
*/

var macUser = require('os').userInfo().username;
var macUsersPath = '/Users/' + macUser;
var macDesktopPath = macUsersPath + '/Desktop/';
var kindling = require(macUsersPath + '/.kindling')
var encryptor = require('simple-encryptor')(kindling.secret);
var settings = require('./settings.json')
var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var cache = require('gulp-cache');
var notify = require("gulp-notify");
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
var prompt = require('gulp-prompt');
var git = require('gulp-git');
const zip = require('gulp-zip');
var open = require('gulp-open');
var log = require('fancy-log');

const sass = require('gulp-sass')(require('sass'));
const mysqldump = require('mysqldump')
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require('imagemin-mozjpeg');
const notifier = require('node-notifier');

/*
* >>========================================>
* File Paths
* >>========================================>
*/

var pathToTheme = "";

if(settings.type == 'wordpress'){
	pathToTheme = "wp-content/themes/" + settings.theme + '/';
}

const paths = {
	scripts: {
		src: [
			"./node_modules/jquery/dist/jquery.js",
			"./node_modules/gsap/dist/gsap.min.js",
			"./src/js/vendor/*.js",
			"./src/js/main.js"
		],
		dest: "./dist/" + pathToTheme + "js/"
	},
	styles: {
		src: [
			"./src/scss/*.scss",
		],
		dest: "./dist/" + pathToTheme + "css/"
	},
	wp_styles: {
		src: [
			"./src/scss/*.scss",
		],
		dest: "./dist/" + pathToTheme
	},
	dom: {
		src: [
			"./src/**/*.html",
			"./src/**/*.php"
		],
		dest: "./dist/" + pathToTheme
	},
	images: {
		src: "./src/img/**",
		dest: "./dist/" + pathToTheme + "img/"
	}
};

/*
* >>========================================>
* Database
* >>========================================>
*/

function backupDatabase(cb){
	if(settings.database != '') {
		return mysqldump({
			connection: {
				host:     kindling.local.mysql.host,
				user:     kindling.local.mysql.username,
				password: kindling.local.mysql.password,
				database: settings.database
			},
			dump: {
				data: {
					format : false
				}
			},
			dumpToFile: settings.database + '.sql'
		});
	}

	cb();
}
 
/*
* >>========================================>
* Script (JS)
* >>========================================>
*/

function compressJS(cb) {
	return gulp
		.src(paths.scripts.src)
		.on("error", function(err) {
			notify({
				title: 'Kindling',
				icon: 'undefined',
				contentImage: 'undefined'
			}).write(err);
			this.emit('end');
		})
		.pipe(concat("main.js"))
		.pipe(uglify())
		.pipe(notify({
			title: 'Kindling',
			message: 'Javascript compression complete',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.scripts.dest));

	cb();
}

function combineJS(cb) {
	return gulp
		.src(paths.scripts.src)
		.on("error", function(err) {
			notify({
				title: 'Kindling',
				icon: 'undefined',
				contentImage: 'undefined'
			}).write(err);
			this.emit('end');
		})
		.pipe(concat("main.js"))
		.pipe(notify({
			title: 'Kindling',
			message: 'Javascript concatenation complete',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.scripts.dest));

	cb();
}

/*
* >>========================================>
* DOM
* >>========================================>
*/

function compressDOM(cb) {
	return gulp
		.src(paths.dom.src)
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				conservativeCollapse: true,
				preserveLineBreaks: true,
				removeComments: true
			})
		)
		.pipe(gulp.dest(paths.dom.dest));

	cb();
}

function copyFilesToDist(cb){
	return gulp
		.src(['./src/**', './src/**/.*', '!./src/js/**', '!./src/scss/**'])
		.pipe(notify({
			title: 'Kindling',
			message: 'Files successfully copied to ./dist',
			icon: 'undefined',
			contentImage: 'undefined',
			onLast: true
		}))
		.pipe(gulp.dest('./dist/' + pathToTheme));
}

/*
* >>========================================>
* SASS/CSS
* >>========================================>
*/

function compressSASS(cb) {
	if(settings.type == 'wordpress'){
		return gulp
			.src(paths.wp_styles.src)
			.pipe(sourcemaps.init())
			.pipe(
				sass({
					outputStyle: "compressed"
				})
			)
			.on("error", function(err) {
				notify({
					title: 'Kindling',
					icon: 'undefined',
					contentImage: 'undefined'
				}).write(err);
				this.emit('end');
			})
			.pipe(autoprefixer())
			.pipe(rename(
				function(path){
					if(path.basename == 'main') {
						path.basename = "style";
					}
				}
			))
			.pipe(notify({
				title: 'Kindling',
				message: 'SASS compilation and compression complete',
				icon: 'undefined',
				contentImage: 'undefined',
				onLast: true
			}))
			.pipe(gulp.dest(paths.wp_styles.dest))
			.pipe(browserSync.stream());

		cb();
	}else{
		return gulp
			.src(paths.styles.src)
			.pipe(sourcemaps.init())
			.pipe(
				sass({
					outputStyle: "compressed"
				})
			)
			.on("error", function(err) {
				notify({
					title: 'Kindling',
					icon: 'undefined',
					contentImage: 'undefined'
				}).write(err);
				this.emit('end');
			})
			.pipe(autoprefixer())
			.pipe(notify({
				title: 'Kindling',
				message: 'SASS compilation and compression complete',
				icon: 'undefined',
				contentImage: 'undefined',
				onLast: true
			}))
			.pipe(gulp.dest(paths.styles.dest))
			.pipe(browserSync.stream());

		cb();
	}
}

function compileSASS(cb) {
	if(settings.type == 'wordpress'){
		return gulp
			.src(paths.wp_styles.src)
			.pipe(sourcemaps.init())
			.pipe(
				sass({
					outputStyle: "expanded"
				})
			)
			.on("error", function(err) {
				notify({
					title: 'Kindling',
					icon: 'undefined',
					contentImage: 'undefined'
				}).write(err);
				this.emit('end');
			})
			.pipe(sourcemaps.write('.'))
			.pipe(rename(
				function(path){
					if(path.basename == 'main') {
						path.basename = "style";
					}
				}
			))
			.pipe(notify({
				title: 'Kindling',
				message: 'SASS compilation complete',
				icon: 'undefined',
				contentImage: 'undefined',
				onLast: true
			}))
			.pipe(gulp.dest(paths.wp_styles.dest))
			.pipe(browserSync.stream());

		cb();
	}else{
		return gulp
			.src(paths.styles.src)
			.pipe(sourcemaps.init())
			.pipe(
				sass({
					outputStyle: "expanded"
				})
			)
			.on("error", function(err) {
				notify({
					title: 'Kindling',
					icon: 'undefined',
					contentImage: 'undefined'
				}).write(err);
				this.emit('end');
			})
			.pipe(sourcemaps.write('.'))
			.pipe(notify({
				title: 'Kindling',
				message: 'SASS compilation complete',
				icon: 'undefined',
				contentImage: 'undefined',
				onLast: true
			}))
			.pipe(gulp.dest(paths.styles.dest))
			.pipe(browserSync.stream());

		cb();
	}
	
}

/*
* >>========================================>
* Images
* >>========================================>
*/

function compressImg(cb) {
	return gulp
		.src(paths.images.src)
		.pipe(cache(imagemin([
			imageminMozjpeg({quality: 75}),
			imagemin.optipng({optimizationLevel: 6})
		], {
			verbose: true
		})))
		.pipe(notify({
			title: 'Kindling',
			message: 'Image compression complete',
			icon: 'undefined',
			contentImage: 'undefined',
			onLast: true
		}))
		.pipe(gulp.dest(paths.images.dest));

	cb();
}

/*
* >>========================================>
* Start Server and Live Reload
* >>========================================>
*/

function startServer(cb) {
	if(settings.local_url === '') {
		browserSync.init({
			server: {
				baseDir: "./dist/"
			}
		});
	}else{
		browserSync.init({
			proxy: settings.local_url
		});
	}

	notifier.notify({
		title: 'Kindling',
		message: 'Server started',
		icon: 'undefined',
		contentImage: 'undefined'
	});
	
	cb();
}

/*
* >>========================================>
* Watch Folders for Changes
* >>========================================>
*/

function watchForChanges() {
	gulp.watch(paths.scripts.src, gulp.series(combineJS, liveReload));
	gulp.watch("./src/scss/**/*", gulp.series(compileSASS));
	gulp.watch(['./src/**', '!./src/js/**', '!./src/scss/**'], {events: ['all']}, gulp.series(copyFilesToDist, liveReload));
}

function liveReload(cb) {
	browserSync.reload();

	cb();
}

/*
* >>========================================>
* Deployment
* >>========================================>
*/

var deploymentCheck,
	wpDeploymentType;

function confirmDeployment(cb){
	return gulp.src('./package.json')
		.pipe(prompt.prompt([
		{
			type: 'list',
			name: 'deploymentCheck',
			message: 'Are you sure you want to deploy (FTP)?',
			choices: ['Yes', 'No'],
		},
		], function(res){
			deploymentCheck = res.deploymentCheck.toLowerCase();
			cb();
		}))
		.pipe(gulp.dest('./'))
}

function confirmWPDeploymentType(cb){
	if(settings.type == 'wordpress'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'list',
				name: 'wpDeploymentType',
				message: 'Select deployment type:?',
				choices: ['All', 'Theme', 'Uploads'],
			},
			], function(res){
				wpDeploymentType = res.wpDeploymentType.toLowerCase();
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function deployToServer(){

	var deployTimestamp = new Date();
	deployDate = deployTimestamp.getFullYear() + "-" + ('0' + (deployTimestamp.getMonth() + 1)).slice(-2) + "-" + ('0' + deployTimestamp.getDate()).slice(-2);
	
	var deployTime =  " " + ('0' + deployTimestamp.getHours()).slice(-2) + ":" + ('0' + deployTimestamp.getMinutes()).slice(-2) + ":" + ('0' + deployTimestamp.getSeconds()).slice(-2);
	commitSummary = 'Deploy: ' + deployDate + ' ' + deployTime;
	
	if(settings.server == 'other'){
		var conn = ftp.create( {
			host:     encryptor.decrypt(settings.host),
			user:     encryptor.decrypt(settings.username),
			password: encryptor.decrypt(settings.password),
			parallel: 4,
			log:      gutil.log
		});
	}else{
		var conn = ftp.create( {
			host:     encryptor.decrypt(kindling.remote[settings.server].ftp.host),
			user:     encryptor.decrypt(kindling.remote[settings.server].ftp.username),
			password: encryptor.decrypt(kindling.remote[settings.server].ftp.password),
			parallel: 4,
			log:      gutil.log
		});
	}
	
	if(wpDeploymentType == 'theme'){
		return gulp.src( './dist/' + pathToTheme + '**', { base:  './dist/' + pathToTheme, buffer: false } )
			.pipe(conn.dest(settings.remote_path + '/' + pathToTheme));
	}else if(wpDeploymentType == 'uploads'){
		return gulp.src( './dist/wp-content/uploads/' + '**', { base:  './dist/wp-content/uploads/', buffer: false } )
			.pipe(conn.dest(settings.remote_path + '/wp-content/uploads/' ));
	}else{
		return gulp.src( './dist/**', { base: './dist/', buffer: false } )
			.pipe(conn.dest(settings.remote_path));
	}

	cb();
}

function deploymentComplete(cb){
	return gulp.src(__filename)
		.pipe(open({uri: settings.url}));

	log('Project deployed: ' + settings.url);

	cb();
}

/*
* >>========================================>
* Release
* >>========================================>
*/

var releaseToZip = '';

function promptForReleaseMethod(cb){
	
	var releaseTimestamp = new Date();
	releaseDate = releaseTimestamp.getFullYear() + "-" + ('0' + (releaseTimestamp.getMonth() + 1)).slice(-2) + "-" + ('0' + releaseTimestamp.getDate()).slice(-2);

	return gulp.src('./*')
		.pipe(prompt.prompt([
		{
			type: 'list',
			name: 'releaseMethod',
			message: 'Zip the project?',
			choices: ['No','Yes'],
		}
		], function(res){
			releaseToZip = res.releaseMethod.toLowerCase();
		}))

	cb();
}

function packageFiles(cb){
	if(releaseToZip == 'yes') {
		return gulp
			.src('./dist/**')
			.pipe(zip(settings.repo + '_' + releaseDate + '.zip'))
			.pipe(gulp.dest(macDesktopPath))
			cb();
	}else{
		return gulp
			.src('./dist/**')
			.pipe(gulp.dest(macDesktopPath + settings.repo  + '/'));
			cb();
	}
}

/*
* >>========================================>
* Git
* >>========================================>
*/

var commitSummary = '';

function promptForSummary(cb){
	return gulp.src('./*')
		.pipe(prompt.prompt([
		{
			type: 'input',
			name: 'summary',
			message: 'Commit Summary (optional):'
		}
		], function(res){
			if(res.summary != ''){
				commitSummary = res.summary;
			}else{
				var commitDate = new Date();
				commitDate = commitDate.getFullYear() + "-" + ('0' + (commitDate.getMonth() + 1)).slice(-2) + "-" + ('0' + commitDate.getDate()).slice(-2) + " " + ('0' + commitDate.getHours()).slice(-2) + ":" + ('0' + commitDate.getMinutes()).slice(-2) + ":" + ('0' + commitDate.getSeconds()).slice(-2);
				commitSummary = commitDate;
			}

			if(deploymentCheck == 'yes') {
				commitSummary = commitSummary + ' (Deploy)';
			}else if(releaseToZip != ''){
				commitSummary = commitSummary + ' (Release)';
			}else{
				commitSummary = commitSummary + ' (Build)';
			}
		}))

	cb();
}

function gitAdd(cb){
	return gulp.src('./')
		.pipe(git.add());
}

function gitCommit(cb){
	return gulp.src('./')
		.pipe(git.commit(commitSummary));
}

function gitPush(cb){
	git.revParse({args:'--abbrev-ref HEAD'}, function (err, branch) {
		currentBranch = branch;

		git.push('origin', branch, function (err) {
			//if (err) ...
		});

		cb();
	});
}

/*
* >>========================================>
* Build Tasks
* >>========================================>
*/

function delDistDir(cb) {
	return del('./dist/' + pathToTheme);

	cb();
}

function buildComplete(cb){
	notifier.notify({
		title: 'Kindling',
		message: 'Tasks successfully completed',
		icon: 'undefined',
		contentImage: 'undefined'
	});

	cb();
}

const buildTasks = gulp.series(
	promptForSummary,
	delDistDir,
	copyFilesToDist,
	gulp.parallel(
		compressJS,
		compressSASS,
		compressDOM,
		compressImg
	),
	backupDatabase,
	gitAdd,
	gitCommit,
	gitPush,
	buildComplete
);

gulp.task("build", buildTasks);

/*
* >>========================================>
* Development Tasks
* >>========================================>
*/

const devTasks = gulp.series(
	delDistDir,
	copyFilesToDist,
	combineJS,
	compileSASS,
	startServer,
	watchForChanges
);

gulp.task("develop", devTasks);

/*
* >>========================================>
* Git Tasks
* >>========================================>
*/

const gitTasks = gulp.series(
	promptForSummary,
	gitAdd,
	gitCommit,
	gitPush
);

gulp.task("commit", gitTasks);

/*
* >>========================================>
* Database Tasks
* >>========================================>
*/

const databaseTasks = gulp.series(
	backupDatabase
);

gulp.task("database", databaseTasks);

/*
* >>========================================>
* Deployment Tasks
* >>========================================>
*/

const deploymentTasks = gulp.series(
	confirmDeployment,
	confirmWPDeploymentType,
	promptForSummary,
	delDistDir,
	copyFilesToDist,
	gulp.parallel(
		compressJS,
		compressSASS,
		compressDOM,
		compressImg
	),
	backupDatabase,
	gitAdd,
	gitCommit,
	gitPush,
	deployToServer,
	deploymentComplete
);

gulp.task("deploy", deploymentTasks);

/*
* >>========================================>
* Release Tasks
* >>========================================>
*/

const releaseTasks = gulp.series(
	promptForReleaseMethod,
	promptForSummary,
	delDistDir,
	copyFilesToDist,
	gulp.parallel(
		compressJS,
		compressSASS,
		compressDOM,
		compressImg
	),
	backupDatabase,
	gitAdd,
	gitCommit,
	gulp.parallel(
		gitPush,
		packageFiles
	),
	buildComplete
);

gulp.task("release", releaseTasks);