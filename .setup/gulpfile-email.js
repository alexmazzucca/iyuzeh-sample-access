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
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require('gulp-sourcemaps');
var prettyHtml = require('gulp-pretty-html');
var inlineCSS = require('gulp-inline-css');
var replace = require('gulp-replace');
var cache = require('gulp-cache');
var notify = require("gulp-notify");
var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );
var prompt = require('gulp-prompt');
var git = require('gulp-git');
var fs = require('fs');
var open = require('gulp-open');
var log = require('fancy-log');

const sass = require('gulp-sass')(require('sass'));
const zip = require('gulp-zip');
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
	styles: {
		src: [
			"./src/scss/*.scss",
		],
		dest: "./dist/css/"
	},
	dom: {
		src: [
			"./src/**/*.html"
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
* DOM
* >>========================================>
*/

function compressEmailDOM(cb){
	return gulp
		.src('./src/index.html')
		.pipe(
			htmlmin({
				collapseWhitespace: true,
				conservativeCollapse: true,
				preserveLineBreaks: true,
				removeComments: true,
				keepClosingSlash: true,
				removeEmptyAttributes: false
			})
		)
		.pipe(prettyHtml())
		.pipe(gulp.dest(paths.dom.dest));
	
	cb();
}

function copyEmailDOM(cb){
	return gulp
		.src('./src/index.html')
		.pipe(gulp.dest(paths.dom.dest));

	cb();
}

function updateEmailImagePaths(cb){
	if(settings.url != '') {
		return gulp
			.src('./dist/index.html')
			.pipe(replace('background="img/', 'background="' + settings.url + '/img/'))
			.pipe(replace('src="img/', 'src="' + settings.url + '/img/'))
			.pipe(gulp.dest(paths.dom.dest));
	}
	
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

/*
* >>========================================>
* SASS/CSS
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
		.pipe(sourcemaps.write('.'))
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

function compileEmailSASS(cb){
	return gulp
		.src('./src/scss/*.scss')
		.pipe(
			sass()
		)
		.on("error", function(err) {
			notify({
				title: 'Kindling',
				icon: 'undefined',
				contentImage: 'undefined'
			}).write(err);
			this.emit('end');
		})
		.pipe(gulp.dest(paths.styles.dest))
		.pipe(browserSync.stream());

	cb();
}

var responsiveCSS;
var isResponsive = false;

function checkForResponsiveStyles(cb) {
	responsiveCSS = fs.readFileSync('./dist/css/head.css');
	
	if(responsiveCSS == '' || responsiveCSS == undefined) {
		isResponsive = false;
	} else {
		isResponsive = true;
	}

	cb();
}

function createInternalStyles(cb) {
	return gulp
		.src('./dist/index.html')
		.pipe(replace('</head>',
			function() {
				if(isResponsive){
					return '<style type="text/css">' + responsiveCSS + '</style></head>';
				}else{
					return '</head>';
				}
			}
		))
		.pipe(gulp.dest(paths.dom.dest))
	
	cb();
}

function inlineStyles(cb) {
	return gulp
		.src('./dist/index.html')
		.pipe(inlineCSS({
			applyLinkTags: true,
			removeStyleTags: false,
			removeLinkTags: false,
			removeHtmlSelectors: !isResponsive,
			xmlMode: true
		}))
		.pipe(gulp.dest(paths.dom.dest))

	cb();
}

function removeStyleLink(cb) {
	return gulp
		.src('./dist/index.html')
		.pipe(replace('<link rel="stylesheet" href="css/inline.css"/>', ''))
		.pipe(gulp.dest(paths.dom.dest));
	cb();
}

function delTempCSSDir(cb) {
	return del(paths.styles.dest);

	cb();
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
	gulp.watch(paths.dom.src, gulp.series(copyEmailDOM, liveReload));
	gulp.watch(paths.styles.src, gulp.series(compressSASS));
	gulp.watch(paths.images.src, {events: ['all']}, gulp.series(compressImg, liveReload));
	gulp.watch(['./src/**', '!./src/scss/**', '!./src/img/**', '!./src/**/*.html'], {events: ['add']}, gulp.series(copyFilesToDist, liveReload));
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
		.pipe(conn.dest(settings.remote_path));
		
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

const emailBuildTasks = gulp.series(
	delDistDir,
	compileEmailSASS,
	compressEmailDOM,
	compressImg,
	updateEmailImagePaths,
	checkForResponsiveStyles,
	inlineStyles,
	createInternalStyles,
	removeStyleLink,
	delTempCSSDir,
	buildComplete
);

gulp.task("build", emailBuildTasks);

/*
* >>========================================>
* Development Tasks
* >>========================================>
*/

const emailDevTasks = gulp.series(
	delDistDir,
	compressSASS,
	copyEmailDOM,
	compressImg,
	startServer,
	watchForChanges
);

gulp.task("develop", emailDevTasks);

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
* Build & Commit Tasks
* >>========================================>
*/

function buildCommitComplete(cb){
	notifier.notify({
		title: 'Kindling',
		message: 'Project commit complete',
		icon: 'undefined',
		contentImage: 'undefined'
	});

	cb();
}

const commitTasks = gulp.series(
	promptForSummary,
	delDistDir,
	compileEmailSASS,
	compressEmailDOM,
	compressImg,
	updateEmailImagePaths,
	checkForResponsiveStyles,
	inlineStyles,
	createInternalStyles,
	removeStyleLink,
	delTempCSSDir,
	gitAdd,
	gitCommit,
	gitPush,
	buildCommitComplete
);

gulp.task("commit", commitTasks);

/*
* >>========================================>
* Deployment Tasks
* >>========================================>
*/

const deploymentTasks = gulp.series(
	confirmDeployment,
	promptForSummary,
	delDistDir,
	compileEmailSASS,
	compressEmailDOM,
	compressImg,
	updateEmailImagePaths,
	checkForResponsiveStyles,
	inlineStyles,
	createInternalStyles,
	removeStyleLink,
	delTempCSSDir,
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
	compileEmailSASS,
	compressEmailDOM,
	compressImg,
	updateEmailImagePaths,
	checkForResponsiveStyles,
	inlineStyles,
	createInternalStyles,
	removeStyleLink,
	delTempCSSDir,
	gitAdd,
	gitCommit,
	gulp.parallel(
		gitPush,
		packageFiles
	),
	buildComplete
);

gulp.task("release", releaseTasks);