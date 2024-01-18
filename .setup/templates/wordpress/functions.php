<?php

	/*
	>>================================================================================>
	Add ACF Options Page
	>>================================================================================>
	*/

	// // the_field('header_title', 'option');

	// if( function_exists('acf_add_options_page') ) {
	// 	acf_add_options_page(array(
	// 		'page_title' => 'Options',
	// 		'icon_url' => 'dashicons-align-right',
	// 	));
	// }

	/*
	>>================================================================================>
	Remove Emojis
	>>================================================================================>
	*/

	remove_action( 'wp_head', 'print_emoji_detection_script', 7 ); 
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' ); 
	remove_action( 'wp_print_styles', 'print_emoji_styles' ); 
	remove_action( 'admin_print_styles', 'print_emoji_styles' );

	/*
	>>================================================================================>
	Add styles to editor window
	>>================================================================================>
	*/

	function mytheme_block_editor_styles() {
	    wp_enqueue_style( 'mytheme-block-editor-styles', get_theme_file_uri( '/editor-style.css' ), false, '1.0', 'all' );
	}

	add_action( 'enqueue_block_editor_assets', 'mytheme_block_editor_styles' );

	add_editor_style('tinymce-style.css');

	/*
	>>================================================================================>
	Add support for Featured Image
	>>================================================================================>
	*/

	add_theme_support('post-thumbnails');

	/*
	>>================================================================================>
	Add support for custom menus
	>>================================================================================>
	*/

	register_nav_menus();

	/*
	>>================================================================================>
	Add additional mime types (SVG)
	>>================================================================================>
	*/

	// function cc_mime_types($mimes) {
	// 	$mimes['svg'] = 'image/svg+xml';
	// 	return $mimes;
	// }

	// add_filter('upload_mimes', 'cc_mime_types');

	/*
	>>================================================================================>
	Add Custom Post Types
	>>================================================================================>
	*/

	/*

	add_action( 'init', 'create_post_type' );

	function create_post_type() {
		register_post_type( 'case_study',
			array(
				'labels' => array(
				'name' => __( 'Case Studies' ),
				'singular_name' => __( 'Case Study' )
			),
			'has_archive' => true,
			'public' => true,
			'rewrite' => array(
				'slug' => 'case-studies'
			),
			'menu_icon'   => 'dashicons-portfolio',
			'supports' => array('title','editor','thumbnail', 'revisions','excerpt')
			)
		);
	}

	*/

	/*
	>>================================================================================>
	Include files in <head>
	>>================================================================================>
	*/

	function theme_scripts() {
		wp_enqueue_style( 'main-styles', get_stylesheet_uri(), '', '1' );
		wp_enqueue_script( 'main-scripts', get_template_directory_uri() . '/js/main.js', array(), '3', true );
	}

	add_action( 'wp_enqueue_scripts', 'theme_scripts' );

	/*
	>>================================================================================>
	Register Sidebar(s)
	>>================================================================================>
	*/

	// function wpb_widgets_init() {
	// 	register_sidebar( array(
	// 		'name'         => __( 'Sidebar' ),
	// 	    'id'           => 'sidebar',
	// 	    'description'  => __( 'Widgets in this area will be shown on the right-hand side of each page' ),
	// 	    'before_widget' => '<div id="%1$s" class="widget %2$s">',
	// 		'after_widget'  => '</div>',
	// 		'before_title'  => '<h3>',
	// 		'after_title'   => '</h3>'
	// 	));
	// 	register_sidebar( array(
	// 		'name'         => __( 'Footer' ),
	// 	    'id'           => 'footer',
	// 	    'description'  => __( 'Widgets in this area will be shown in the footer of each page' ),
	// 	    'before_widget' => '<div id="%1$s" class="widget %2$s">',
	// 		'after_widget'  => '</div>',
	// 		'before_title'  => '<h3>',
	// 		'after_title'   => '</h3>'
	// 	));
	// }

	// add_action( 'widgets_init', 'wpb_widgets_init' );

	/*
	>>================================================================================>
	Add custom styles drop-down to editor
	>>================================================================================>
	*/

	add_filter( 'mce_buttons_2', 'fb_mce_editor_buttons' );

	function fb_mce_editor_buttons( $buttons ) {
	    array_unshift( $buttons, 'styleselect' );
	    return $buttons;
	}

	add_filter( 'tiny_mce_before_init', 'fb_mce_before_init' );

	function fb_mce_before_init( $settings ) {

	    $style_formats = array(
	        array(
	            'title' => 'Heading 1',
				'selector' => 'h1,h2,h3,h4,h5,h6,p',
	            'classes' => 'heading-1'
			),
			array(
	            'title' => 'Heading 2',
				'selector' => 'h1,h2,h3,h4,h5,h6,p',
	            'classes' => 'heading-2'
			),
			array(
	            'title' => 'Heading 3',
				'selector' => 'h1,h2,h3,h4,h5,h6,p',
	            'classes' => 'heading-3'
			),
			array(
	            'title' => 'Heading 4',
				'selector' => 'h1,h2,h3,h4,h5,h6,p',
	            'classes' => 'heading-4'
			),
			array(
	            'title' => 'Heading 5',
				'selector' => 'h1,h2,h3,h4,h5,h6,p',
	            'classes' => 'heading-5'
			),
			array(
	            'title' => 'Heading 6',
				'selector' => 'h1,h2,h3,h4,h5,h6,p',
	            'classes' => 'heading-6'
			),
	    );

	    $settings['style_formats'] = json_encode( $style_formats );

	    return $settings;
	}

	/*
	>>================================================================================>
	Register ACF Block
	>>================================================================================>
	*/

	// add_action('acf/init', 'my_acf_init_block_types');

	// function my_acf_init_block_types() {

	// 	if( function_exists('acf_register_block_type') ) {

	// 		acf_register_block_type(
	// 			array(
	// 				'name'              => 'custom-block',
	// 				'title'             => __('Custom Block'),
	// 				'description'       => __('Custom block featuring a large image and copy'),
	// 				'render_template'   => 'template-parts/blocks/custom-block.php',
	// 				'category'          => 'formatting',
	// 				'icon'              => 'admin-comments',
	// 				'mode' 				=> 'edit',
	// 				'supports' 			=> array('mode' => false)
	// 			)
	// 		);
	// 	}
	// }

	// /*
	// >>================================================================================>
	// Allow Only Custom Blocks
	// >>================================================================================>
	// */

	// add_filter( 'allowed_block_types_all', 'allowed_block_types', 25, 2 );
 
	// function allowed_block_types( $allowed_blocks, $editor_context ) {
	// 	return array(
	// 		'acf/custom-block'
	// 	);	
	// }

	/*
	>>================================================================================>
	Remove Default Posts Type (no blog)
	>>================================================================================>
	*/

	// // Remove side menu
	// add_action( 'admin_menu', 'remove_default_post_type' );

	// function remove_default_post_type() {
	// 	remove_menu_page( 'edit.php' );
	// }

	// // Remove +New post in top Admin Menu Bar
	// add_action( 'admin_bar_menu', 'remove_default_post_type_menu_bar', 999 );

	// function remove_default_post_type_menu_bar( $wp_admin_bar ) {
	// 	$wp_admin_bar->remove_node( 'new-post' );
	// }

	// // Remove Quick Draft Dashboard Widget
	// add_action( 'wp_dashboard_setup', 'remove_draft_widget', 999 );

	// function remove_draft_widget(){
	// 	remove_meta_box( 'dashboard_quick_press', 'dashboard', 'side' );
	// }

	/*
	>>================================================================================>
	Custom WYSIWYG Toolbars
	>>================================================================================>
	*/

	// https://www.tiny.cloud/docs/advanced/available-toolbar-buttons/
	
	function my_toolbars( $toolbars ) {
		
		// Used in Banners
		
		$toolbars['Very Simple'] = array();
		$toolbars['Very Simple'][1] = array('styleselect', 'bold' , 'italic', 'link', 'bullist', 'superscript');

		// Used in Callouts

		$toolbars['Basic'] = array();
		$toolbars['Basic'][1] = array('code', 'formatselect', 'styleselect', 'bold' , 'italic' , 'link', 'bullist', 'superscript', 'hr');

		return $toolbars;
	}

	add_filter('acf/fields/wysiwyg/toolbars' , 'my_toolbars');

	/*
	>>================================================================================>
	Hide Plugin Versions (Security)
	>>================================================================================>
	*/

	function remove_wp_version_strings( $src ) {
		global $wp_version;
		
		parse_str(parse_url($src, PHP_URL_QUERY), $query);
		
		if ( !empty($query['ver']) && $query['ver'] === $wp_version ) {
			$src = remove_query_arg('ver', $src);
		}
		
		return $src;
	}
	
	add_filter( 'script_loader_src', 'remove_wp_version_strings' );
	add_filter( 'style_loader_src', 'remove_wp_version_strings' );

	/* Hide WP version strings from generator meta tag */
	
	function remove_version() {
		return '';
	}

	add_filter('the_generator', 'remove_version');
	add_filter( 'wpseo_debug_markers', '__return_false' );

	/*
	>>================================================================================>
	Disable Search (Not Compatible with PHP 8.1.13)
	>>================================================================================>
	*/

	/*
	
	function wpb_filter_query( $query, $error = true ) {
		if ( is_search() ) {
			$query->is_search = false;
			$query->query_vars[s] = false;
			$query->query[s] = false;
			if ( $error == true )
				$query->is_404 = true;
		}
	}
	
	add_action( 'parse_query', 'wpb_filter_query' );
	add_filter( 'get_search_form', create_function( '$a', "return null;" ) );
	
	function remove_search_widget() {
	    unregister_widget('WP_Widget_Search');
	}
	
	add_action( 'widgets_init', 'remove_search_widget' );

	*/

	/*
	>>================================================================================>
	Head Cleanup
	>>================================================================================>
	*/

	// Remove Weblog Client Link

	remove_action ('wp_head', 'rsd_link');

	//  Remove Windows Live Writer Manifest Link

	remove_action( 'wp_head', 'wlwmanifest_link');

	// Remove WordPress Generator (Version)

	remove_action('wp_head', 'wp_generator');

	// Remove Page/Post Shortlinks

	remove_action( 'wp_head', 'wp_shortlink_wp_head');

	// Disable REST API Link – api.w.org

	remove_action( 'wp_head', 'rest_output_link_wp_head', 10 );

	// Disable oEmbed Discovery Links and wp-embed.min.js

	remove_action( 'wp_head', 'wp_oembed_add_discovery_links', 10 );
	remove_action( 'wp_head', 'wp_oembed_add_host_js' );
	remove_action('rest_api_init', 'wp_oembed_register_route');
	remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);

	// Remove RSS Feed Links

	function disable_feeds() {
		wp_die( __( 'No feed available, please visit the <a href="'. esc_url( home_url( '/' ) ) .'">homepage</a>!' ) );
	}

	add_action('do_feed', 'disable_feeds', 1);
	add_action('do_feed_rdf', 'disable_feeds', 1);
	add_action('do_feed_rss', 'disable_feeds', 1);
	add_action('do_feed_rss2', 'disable_feeds', 1);
	add_action('do_feed_atom', 'disable_feeds', 1);
	add_action('do_feed_rss2_comments', 'disable_feeds', 1);
	add_action('do_feed_atom_comments', 'disable_feeds', 1);

	remove_action( 'wp_head', 'feed_links_extra', 3 );
	remove_action( 'wp_head', 'feed_links', 2 );

	/*
	>>================================================================================>
	Disable Gutenberg on Specific Pages
	>>================================================================================>
	*/

	// /**
	//  * Disable Editor
	//  *
	//  * @package      ClientName
	//  * @author       Bill Erickson
	//  * @since        1.0.0
	//  * @license      GPL-2.0+
	// **/

	// /**
	//  * Templates and Page IDs without editor
	//  *
	//  */
	// function ea_disable_editor( $id = false ) {

	// 	$excluded_templates = array(
	// 		'templates/modules.php',
	// 		'templates/contact.php'
	// 	);

	// 	$excluded_ids = array(
	// 		261
	// 	);

	// 	if( empty( $id ) )
	// 		return false;

	// 	$id = intval( $id );
	// 	$template = get_page_template_slug( $id );

	// 	return in_array( $id, $excluded_ids ) || in_array( $template, $excluded_templates );
	// }

	// /**
	//  * Disable Gutenberg by template
	//  *
	//  */
	// function ea_disable_gutenberg( $can_edit, $post_type ) {

	// 	if( ! ( is_admin() && !empty( $_GET['post'] ) ) )
	// 		return $can_edit;

	// 	if( ea_disable_editor( $_GET['post'] ) )
	// 		$can_edit = false;

	// 	return $can_edit;

	// }

	// // add_filter( 'gutenberg_can_edit_post_type', 'ea_disable_gutenberg', 10, 2 );
	// // add_filter( 'use_block_editor_for_post_type', 'ea_disable_gutenberg', 10, 2 );

	// /**
	//  * Disable Classic Editor by template
	//  *
	//  */
	// function ea_disable_classic_editor() {

	// 	$screen = get_current_screen();
	// 	if( 'page' !== $screen->id || ! isset( $_GET['post']) )
	// 		return;

	// 	if( ea_disable_editor( $_GET['post'] ) ) {
	// 		remove_post_type_support( 'page', 'editor' );
	// 	}

	// }

	// add_action( 'admin_head', 'ea_disable_classic_editor' );

?>