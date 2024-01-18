var settings = {
	title: '',
	repo: '',
	repoURL: '',
	description: '',
	type: '',
	url: '',
	local_url: '',
	database: '',
	theme: '',
	server: '',
	host: '',
	username: '',
	password: '',
	remote_path: '',
};

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
var gulp = require("gulp");
var git = require('gulp-git');
var rename = require("gulp-rename");
var prompt = require('gulp-prompt');
var notify = require("gulp-notify");
var jsonModify = require("gulp-json-modify");
var getRepoInfo = require('git-repo-info');
var replace = require('gulp-replace');

const del = require("del");
const path = require('path');
const notifier = require('node-notifier');

/*
* >>========================================>
* Setup Tasks
* >>========================================>
*/

function initialPromptForProjectInfo(cb){
	return gulp.src('./package.json')
		.pipe(prompt.prompt([
		{
			type: 'list',
			name: 'type',
			message: 'Project type:',
			choices: ['Email', 'Banner', 'Static', 'WordPress'],
		},
		{
			type: 'input',
			name: 'title',
			message: 'Project title:'
		}
		], function(res){
			settings.title = res.title;
			settings.type = res.type.toLowerCase();
			settings.description = 'Repo for the development of ' + res.title;
			cb();
		}))
		.pipe(gulp.dest('./'))
}

var bannerWidth,
	bannerHeight;

function promptForBannerDetails(cb){
	if(settings.type == 'banner'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'bannerWidth',
				message: 'Banner width:'
			},
			{
				type: 'input',
				name: 'bannerHeight',
				message: 'Banner height:'
			}
			], function(res){
				bannerWidth = res.bannerWidth;
				bannerHeight = res.bannerHeight;
				settings.description += ' (' + bannerWidth + 'x' + bannerHeight + ')';
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function promptForURL(cb){
	if(settings.server != 'no'){
		if(settings.server == 'elevate'){
			if(settings.type == 'email' || settings.type == 'banner'){
				settings.url = 'https://clients.elevatehc.com' + '/' +  settings.remote_path;
			}else{
				return gulp.src('./package.json')
					.pipe(prompt.prompt([
					{
						type: 'input',
						name: 'url',
						message: 'Remote URL (e.g. "https://yoursite.elevatehc.com"):'
					}
					], function(res){
						settings.url = res.url;
						cb();
					}))
					.pipe(gulp.dest('./'))
			}
			cb();
		}else if(settings.server == 'xavier'){
			settings.url = 'https://xaviercreative.com/client-work' + '/' +  settings.remote_path;
			cb();
		}else if(settings.server == 'archer'){
			settings.url = 'http://clients.archerinteractive.com' + '/' + settings.remote_path;
			cb();
		}else{
			return gulp.src('./package.json')
				.pipe(prompt.prompt([
				{
					type: 'input',
					name: 'url',
					message: 'Remote URL (e.g. "http://yoursite.com"):'
				}
				], function(res){
					settings.url = res.url;
					cb();
				}))
				.pipe(gulp.dest('./'))
		}
	}else{
		cb();
	}
}

function promptForDevURL(cb){
	if(settings.type == 'static' || settings.type == 'wordpress'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'url',
				message: 'Local URL (MAMP) (e.g. "http://yoursite.local"):'
			}
			], function(res){
				settings.local_url = res.url;
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function promptForSiteDetails(cb){
	if(settings.type == 'wordpress' || settings.type == 'static'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'database',
				message: 'Database name:'
			}
			], function(res){
				settings.database = res.database;
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function promptForDeploymentOptions(cb){
	return gulp.src('./package.json')
		.pipe(prompt.prompt([
		{
			type: 'list',
			name: 'server',
			message: 'Would you like to configure a deployment server?',
			choices: ['No', 'Yes']
		}
		], function(res){
			if(res.server == "Yes"){
				settings.server = res.server.toLowerCase();
			}
			cb();
		}))
		.pipe(gulp.dest('./'))
}

var serverPreset;

function promptForServerPreset(cb){
	if(settings.server == 'yes'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'list',
				name: 'server',
				message: 'Please select a server:',
				choices: ['Elevate', 'Xavier', 'Archer', 'Other']
			}
			], function(res){
				settings.server = res.server.toLowerCase();
				if(settings.server == 'xavier'){
					settings.remote_path = settings.repo;
				}else if(settings.server == 'archer'){
					settings.remote_path = settings.repo;
				}
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function promptForRemoteDirectory(cb){
	if(settings.server == 'elevate' || settings.server == 'other'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'remote',
				message: 'Enter a remote directory (e.g. "client_name"):'
			},
			{
				type: 'list',
				name: 'repo',
				message: 'Append repo name to remote path?',
				choices: ['Yes', 'No']
			}
			], function(res){
				if(res.repo == 'No') {
					settings.remote_path = res.remote;
				}else{
					settings.remote_path = res.remote  + '/' + settings.repo;
				}
				
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function promptForWordpressDetails(cb){
	if(settings.type == 'wordpress'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'theme',
				message: 'Wordpress theme name:'
			}
			], function(res){
				settings.theme = res.theme;
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function promptForLiveDeployentDetails(cb){
	if(settings.server == 'other'){
		return gulp.src('./package.json')
			.pipe(prompt.prompt([
			{
				type: 'input',
				name: 'host',
				message: 'FTP Host:'
			},
			{
				type: 'input',
				name: 'username',
				message: 'FTP Username:'
			},
			{
				type: 'input',
				name: 'password',
				message: 'FTP Password:'
			},
			{
				type: 'input',
				name: 'remote_path',
				message: 'Remote Path (optional):'
			}
			], function(res){
				settings.host = encryptor.encrypt(res.host);
				settings.username = encryptor.encrypt(res.username);
				settings.password = encryptor.encrypt(res.password);
				settings.remote_path = res.remote_path;
				cb();
			}))
			.pipe(gulp.dest('./'))
	}else{
		cb();
	}
}

function updateProjectInfo(cb){
	var info = getRepoInfo();
	settings.repo = path.basename(process.cwd());
	settings.repoURL = 'https://github.com/alexmazzucca/' + settings.repo + '.git';
	cb();
}

function renameWorkspaceFile(){
	return gulp
		.src('./.setup/workspace.code-workspace')
		.pipe(rename(function (path) {
			path.basename = settings.repo;
		}))
		.pipe(gulp.dest('./'))
	cb();
}

function updatePackageInfo(){
	return gulp.src('./package.json')
		.pipe(jsonModify({
			key: 'name',
			value: settings.repo
		}))
		.pipe(jsonModify({
			key: 'description',
			value: settings.description
		}))
		.pipe(jsonModify({
			key: 'repository.url',
			value: settings.repoURL
		}))
		.pipe(gulp.dest('./'))
}

function updateProjectSettings(cb){
	return gulp.src('./.setup/settings.json')
		.pipe(jsonModify({
			key: 'type',
			value: settings.type
		}))
		.pipe(jsonModify({
			key: 'url',
			value: settings.url
		}))
		.pipe(jsonModify({
			key: 'local_url',
			value: settings.local_url
		}))
		.pipe(jsonModify({
			key: 'database',
			value: settings.database
		}))
		.pipe(jsonModify({
			key: 'theme',
			value: settings.theme
		}))
		.pipe(jsonModify({
			key: 'server',
			value: settings.server
		}))
		.pipe(jsonModify({
			key: 'host',
			value: settings.host
		}))
		.pipe(jsonModify({
			key: 'username',
			value: settings.username
		}))
		.pipe(jsonModify({
			key: 'password',
			value: settings.password
		}))
		.pipe(jsonModify({
			key: 'remote_path',
			value: settings.remote_path
		}))
		.pipe(jsonModify({
			key: 'repo',
			value: settings.repo
		}))
		.pipe(gulp.dest('./'));
	
	cb();
}

function copyTemplateFilesToSrc(){
	return gulp
		.src([
			'./.setup/templates/' + settings.type +  '/**/*',
			'!./.setup/templates/static/robots.txt',
			'!./.setup/templates/static/.htaccess'
		])
		.pipe(gulp.dest('./src/'));
}

function delTempSrcFiles(cb) {
	return del('./src/*');

	cb();
}

function copyTemplateAssetsToSrc(cb){
	if(settings.type == 'static' || settings.type == 'wordpress'){
		return gulp
			.src([
				'./.setup/templates/scss*/**/*',
				'./.setup/templates/js*/**/*'
			])
			.pipe(gulp.dest('./src/'));
	}
	cb();
}

function copyTemplateFilesToDist(cb){
	if(settings.type == 'static'){
		return gulp
			.src([
				'./.setup/templates/static/.htaccess',
				'./.setup/templates/static/robots.txt'
			])
			.pipe(gulp.dest('./dist/'));
	}
	cb();
}

function changeNotificationIcon(cb){
	return gulp
		.src('./.setup/Terminal.icns')
		.pipe(gulp.dest('./node_modules/node-notifier/vendor/mac.noindex/terminal-notifier.app/Contents/Resources/'))
	cb();
}

function updateBuildTasks(cb){
	if(settings.server != '' && settings.type != 'email'){
		if(settings.database != ''){
			return gulp
				.src('./.setup/tasks-deployment-database.json')
				.pipe(rename(function (path) {
					path.basename = 'tasks';
				}))
				.pipe(gulp.dest('./.vscode/'))
			cb();
		}else{
			return gulp
				.src('./.setup/tasks-deployment.json')
				.pipe(rename(function (path) {
					path.basename = 'tasks';
				}))
				.pipe(gulp.dest('./.vscode/'))
			cb();
		}
	}else {
		if(settings.type == 'email'){
			if(settings.server != 'no'){
				return gulp
					.src('./.setup/tasks-email-deployment.json')
					.pipe(rename(function (path) {
						path.basename = 'tasks';
					}))
					.pipe(gulp.dest('./.vscode/'))
				cb();
			}else{
				return gulp
					.src('./.setup/tasks-email.json')
					.pipe(rename(function (path) {
						path.basename = 'tasks';
					}))
					.pipe(gulp.dest('./.vscode/'))
				cb();
			}
		}else{
			return gulp
			.src('./.setup/tasks.json')
			.pipe(gulp.dest('./.vscode/'))
			cb();
		}
	}
}

function updateBannerHTML(cb){
	if(settings.type == 'banner'){
	return gulp.src(['./src/index.html'])
			.pipe(replace('<title></title>', '<title>' + bannerWidth +  'x' + bannerHeight + '</title>'))
			.pipe(replace('<meta name="ad.size" content="">', '<meta name="ad.size" content="width=' + bannerWidth + ',height=' + bannerHeight + '">'))
			.pipe(gulp.dest('./src/'));
		cb();
	}else{
		cb();
	}
}

function updateBannerCSS(cb){
	if(settings.type == 'banner'){
		return gulp.src(['./src/scss/main.scss'])
			.pipe(replace('/* width */', bannerWidth + 'px'))
			.pipe(replace('/* height */', bannerHeight + 'px'))
			.pipe(gulp.dest('./src/scss/'));
		cb();
	}else{
		cb();
	}
}

function updateGulpFile(cb){
	if(settings.type == 'email'){
		return gulp
			.src('./.setup/gulpfile-email.js')
			.pipe(rename(function (path) {
				path.basename = 'gulpfile';
			}))
			.pipe(gulp.dest('./'))
		cb();
	}else if(settings.type == 'banner'){
		return gulp
			.src('./.setup/gulpfile-banner.js')
			.pipe(rename(function (path) {
				path.basename = 'gulpfile';
			}))
			.pipe(gulp.dest('./'))
		cb();
	}else {
		return gulp
			.src('./.setup/gulpfile.js')
			.pipe(gulp.dest('./'));
	}
}

function updateREADME(cb){
	return gulp.src(['./.setup/README.md'])
			.pipe(replace('<title>', settings.title))
			.pipe(replace('<description>', settings.description))
			.pipe(replace('<type>', settings.type))
			.pipe(gulp.dest('./'));

		cb();
}

const delSetupFiles = () => del(['./.setup']);

function setupComplete(cb){
	notifier.notify({
		title: 'Kindling',
		message: 'Project successfully configured',
		icon: 'undefined',
		contentImage: 'undefined'
	});

	cb();
}

/*
* >>========================================>
* Git
* >>========================================>
*/

var commitSummary = '';

function gitAdd(cb){
	return gulp.src('./')
		.pipe(git.add());
}

var buildDate = new Date()

buildDate = buildDate.getFullYear() + "-" + ('0' + (buildDate.getMonth() + 1)).slice(-2) + "-" + ('0' + buildDate.getDate()).slice(-2) + " " + ('0' + buildDate.getHours()).slice(-2) + ":" + ('0' + buildDate.getMinutes()).slice(-2) + ":" + ('0' + buildDate.getSeconds()).slice(-2);

function gitInitialCommit(cb){
	return gulp.src('./')
		.pipe(git.commit('Setup complete'));
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
* Setup Task Series
* >>========================================>
*/

const setupProject = gulp.series(
	initialPromptForProjectInfo,
	updateProjectInfo,
	promptForBannerDetails,
	promptForSiteDetails,
	promptForDeploymentOptions,
	promptForServerPreset,
	promptForRemoteDirectory,
	promptForURL,
	promptForDevURL,
	promptForLiveDeployentDetails,
	promptForWordpressDetails,
	renameWorkspaceFile,
	updatePackageInfo,
	updateProjectSettings,
	updateGulpFile,
	delTempSrcFiles,
	copyTemplateAssetsToSrc,
	copyTemplateFilesToSrc,
	copyTemplateFilesToDist,
	updateBannerHTML,
	updateBannerCSS,
	changeNotificationIcon,
	updateBuildTasks,
	updateREADME,
	delSetupFiles,
	gitAdd,
	gitInitialCommit,
	gitPush,
	setupComplete
);

gulp.task("setup", setupProject);