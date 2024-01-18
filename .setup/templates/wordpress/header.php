<!doctype html>
<?php echo '<html class="no-js" lang="en">'; ?>
    <head>
		<meta charset="utf-8">
		<meta http-equiv="x-ua-compatible" content="ie=edge">
		<title><?php wp_title(''); ?></title>
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!--Icons-->

		<link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/favicons/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri(); ?>/favicons/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri(); ?>/favicons/favicon-16x16.png">
		<link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/favicons/site.webmanifest">
		<link rel="mask-icon" href="<?php echo get_template_directory_uri(); ?>/favicons/safari-pinned-tab.svg" color="#0f034e">
		<link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicons/favicon.ico">
		<meta name="msapplication-TileColor" content="#ffffff">
		<meta name="msapplication-config" content="<?php echo get_template_directory_uri(); ?>/favicons/browserconfig.xml">
		<meta name="theme-color" content="#ffffff">

		<?php wp_head(); ?>

	</head>

	<?php echo '<body '; ?><?php body_class(); ?><?php echo '>'; ?>

		<!--[if lte IE 9]>
        <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/" target="_blank" rel="noopener">upgrade your browser</a> to improve your experience and security.</p>
        <![endif]-->

        <a class="skip-link" href='#main'>Skip to content</a>

    	<!--
		>>================================================================================>
		Main Header
		>>================================================================================>
		-->

		<header id="main-header">
			<div class="container">
				<div class="toolbar">
					<div class="site-logo">
						<?php if(!is_front_page()) : ?><a href="/" title="← Back to the homepage"><?php endif; ?>
							<img src="<?php echo get_template_directory_uri() . '/img/logo.svg'; ?>" alt="Company Name">
						<?php if(!is_front_page()) : ?></a><?php endif; ?>
						<span>Company Name</span>
					</div>
	                <button role="button" id="burger" aria-label="Click to expand full site navigation">
	                    <span></span>
	                </button>
				</div>
                <nav class="primary-navigation">
	                <?php wp_nav_menu(array(
						'menu' => 'Primary',
						'container' => false
					)); ?>
				</nav>
			</div>
		</header>

		<!--
		>>================================================================================>
		Main Page Content
		>>================================================================================>
		-->

		<?php echo '<main id="main">'; ?>