<?php get_header(); ?>

<!--
>>================================================================================>
Section: Custon Block
>>================================================================================>
-->

<section id="custom-block">
	<div class="container">
		<picture>
			<?php if(get_field('mobile')) : ?>
				<source media="(min-width: 768px)" srcset="<?php echo the_field('desktop'); ?>">
				<source media="(max-width: 767px)" srcset="<?php echo get_field('mobile'); ?>">
			<?php endif; ?>
			<img src="<?php echo get_field('desktop'); ?>" alt="Page Banner Image">
		</picture>

		<?php while(have_rows('repeater')) : the_row(); ?>
			<?php $link = get_sub_field('link'); ?>
			<?php echo $link['url']; ?>
			<?php echo $link['title']; ?>
		<?php endwhile; ?>
	</div>
</section>

<?php get_footer(); ?>