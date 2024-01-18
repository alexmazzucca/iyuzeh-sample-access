<img src="https://user-images.githubusercontent.com/333020/69454644-a2dbdd80-0d34-11ea-8463-2c6b3337e277.png" width="200" height="200">

# Kindling v3.8

Welcome to Kindling ([https://github.com/alexmazzucca/kindling/](https://github.com/alexmazzucca/kindling)): a starting point for the development of static websites, WordPress themes, banners and emails.
  
## Setup

**Please follow the following instructions to properly set up your project:**

  1. Using the CLI of your choice, navigate to the root folder of your new project
  2. Download required node modules by running `npm i`
  3. Run `gulp setup`. If using VSCode, run the build task called 'Setup' to begin (⇧⌘B).

### `gulp setup`

This command will lead you through a series of prompts which will help you set up your new project appropriately. If you'd like to change a setting after the setup process has been completed, you can edit the `settings.json` file located in the root folder of your new project.

The setup command will create appropriate template files for your new project depending on the project type that you select. These template files will be moved to the [./src](/src) and [./dist](/dist) directories where appropriate.

Once the setup process has been completed, the project will be automatically committed with a summary of "Setup complete". It will then be pushed to the project's Git repo.
  
## Usage

Once the setup process is complete, the following tasks will be enabled depending on your project type. These tasks can be run via CLI or via the VSCode build tasks menu (⇧⌘B).

### `gulp develop`

This task will appear as "Develop" in the VSCode build task menu. Once executed, this command will start a local development server. It will concatenate/compile JS files, but it will not compress them, allowing for faster load times and readility for debugging. SASS will be compiled without compression, and a sourcemap will be created for debugging purposes. Images will not be compressed.

The system will watch for changes in the ".src/" directory and process them accordingly. Your browser will be automatically refreshed when a change is detected.

### `gulp build`

This task will appear as "Build" in the VSCode build task menu. Once executed, this command will compile and compress project files (CSS, JS, PNG, JPG, etc.). A copy of the project's database (if available) will export to the root directory of your project. If this task is run on a non-email project, your changes will be automatically synced to the project repo. During this process, you will have the option to add a summary of your changes. If you decide not to add a summary, a summary with a timestamp will be utilized (e.g. "Build: YYYY-MM-DD HH:MM:SS").

### `gulp deploy`

This task will appear as "Deploy" in the VSCode build task menu. Once executed, this command will transfer files via FTP to the server environment that was specified during the setup process.

### `gulp release`

This task will appear as "Release" in the VSCode build task menu. Once executed, this command will release the project's files to your desktop (Mac-only) for simplified sharing.