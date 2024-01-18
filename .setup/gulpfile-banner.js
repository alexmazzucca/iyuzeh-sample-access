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
var inlineCSS = require('gulp-inline-css');
var replace = require('gulp-replace');
var cache = require('gulp-cache');
var notify = require("gulp-notify");
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
var prompt = require('gulp-prompt');
var inline = require('gulp-inline')
var git = require('gulp-git');
const zip = require('gulp-zip');
var open = require('gulp-open');
var log = require('fancy-log');

const sass = require('gulp-sass')(require('sass'));
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

const paths = {
	scripts: {
		src: [
			"./src/js/vendor/*.js",
			"./src/js/main.js"
		],
		dest: "./dist/js/"
	},
	styles: {
		src: [
			"./src/scss/*.scss",
		],
		dest: "./dist/css/"
	},
	wp_styles: {
		src: [
			"./src/scss/*.scss",
		],
		dest: "./dist/"
	},
	dom: {
		src: [
			"./src/**/*.html",
			"./src/**/*.php"
		],
		dest: "./dist/"
	},
	images: {
		src: "./src/img/**",
		dest: "./dist/img/"
	}
};
 
/*
* >>========================================>
* Script (JS) Tasks
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
* DOM Tasks
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
		.pipe(gulp.dest('./dist/'));
}

function updateBackgroundImagePaths(cb){
	return gulp
		.src('./dist/index.html')
		.pipe(replace('background-image:url(../img/', 'background-image:url(img/'))
		.pipe(gulp.dest(paths.dom.dest));
	
	cb();
}

/*
* >>========================================>
* SASS/CSS Tasks
* >>========================================>
*/

function compressSASS(cb) {
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

function inlineStyles(cb) {
	return gulp
		.src('./dist/index.html')
		.pipe(inlineCSS({
			applyStyleTags: true,
			applyLinkTags: true,
			removeStyleTags: true,
			removeLinkTags: true,
			removeHtmlSelectors: true,
			xmlMode: true,
		}))
		.pipe(notify({
			title: 'Kindling',
			message: 'CSS inline complete',
			icon: 'undefined',
			contentImage: 'undefined'
		}))
		.pipe(gulp.dest(paths.dom.dest))

	cb();
}

function delTempCSSDir(cb) {
	return del(paths.styles.dest);

	cb();
}

function delTempJSDir(cb) {
	return del(paths.scripts.dest);

	cb();
}

function inlineStylesJS(cb) {	
	return gulp
	.src('./dist/index.html')
	.pipe(inline({
		disabledTypes: ['svg', 'img'], // Only inline css files
	}))
	.pipe(gulp.dest('dist/'));
}

/*
* >>========================================>
* Image Tasks
* >>========================================>
*/

function compressImg(cb) {
	return gulp
		.src(paths.images.src)
		.pipe(cache(imagemin([
			imageminMozjpeg({quality: 85}),
			imagemin.optipng({optimizationLevel: 5})
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
	browserSync.init({
		server: {
			baseDir: "./dist/"
		}
	});

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
	gulp.watch(paths.dom.src, gulp.series(compressDOM, liveReload));
	gulp.watch(paths.scripts.src, gulp.series(combineJS, liveReload));
	gulp.watch(paths.styles.src, gulp.series(compressSASS));
	gulp.watch(paths.images.src, {events: ['all']}, gulp.series(compressImg, liveReload));
	gulp.watch(['./src/**', '!./src/js/**', '!./src/scss/**', '!./src/img/**', '!./src/**/*.html', '!./src/**/*.php'], {events: ['add']}, gulp.series(copyFilesToDist, liveReload));
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

var deploymentCheck;

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

function deployToServer(){
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
	
	return gulp.src( './dist/**', { base: './dist/', buffer: false } )
		.pipe(conn.dest(settings.remote_path + currentBranch));
		
	cb();
}

function deploymentComplete(cb){
	return gulp.src(__filename)
		.pipe(open({uri: settings.url + currentBranch}));

	log('Project deployed: ' + settings.url + currentBranch);

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

var currentBranch = '';

function gitPush(cb){
	git.revParse({args:'--abbrev-ref HEAD'}, function (err, branch) {
		
		git.push('origin', branch, function (err) {
			//if (err) ...
		});

		if(branch != 'master') {
			currentBranch = '-' + branch;
		}

		cb();
	});
}

/*
* >>========================================>
* Build Tasks
* >>========================================>
*/

function delDistDir(cb) {
	return del('./dist/');

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
	inlineStylesJS,
	updateBackgroundImagePaths,
	delTempCSSDir,
	delTempJSDir,
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
	compressSASS,
	compressDOM,
	compressImg,
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
* Deployment Tasks
* >>========================================>
*/

const deploymentTasks = gulp.series(
	confirmDeployment,
	promptForSummary,
	delDistDir,
	copyFilesToDist,
	gulp.parallel(
		compressJS,
		compressSASS,
		compressDOM,
		compressImg
	),
	inlineStylesJS,
	updateBackgroundImagePaths,
	delTempCSSDir,
	delTempJSDir,
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
	inlineStylesJS,
	updateBackgroundImagePaths,
	delTempCSSDir,
	delTempJSDir,
	gitAdd,
	gitCommit,
	gulp.parallel(
		gitPush,
		packageFiles
	),
	buildComplete
);

gulp.task("release", releaseTasks);