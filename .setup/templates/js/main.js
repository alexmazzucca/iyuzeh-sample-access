/*
* >>========================================>
* Get Viewport Width
* >>========================================>
*/

var viewportWidth;

$(window).on('load resize', function(){
    viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}).trigger('resize');

/*
* >>========================================>
* On Window Load
* >>========================================>
*/

$(window).on('load', function(){
    $('body').addClass('page-loaded');
});

/*
* >>========================================>
* Menu
* >>========================================>
*/

// $('#burger').on('click', function(){
//     $('body').toggleClass('menu-active');
// });

/*
* >>========================================>
* Modals
* >>========================================>
*/

// function openModal(e){
// 	if(e.type != null){
// 		e.preventDefault();
// 		var $modal = $('#' + $(this).data('modal'));
// 	}else{
// 		var $modal = $(e);
// 	}
    
//     $('body').addClass('modal-active');
//     $modal.addClass('active');
// 	$(window).on('resize', modalOverflowCheck).trigger('resize');
// 	setTimeout(function(){
// 		$(document).on('click', outsideClick);
// 		$(document).on('keyup', escapePress);
// 	},300)

// 	if($modal.find('video').length){
// 		$modal.find('video').get(0).play();
// 	}
// }

// function closeModal(){
//     var $modal = $('.modal.active');
//     $modal.removeClass('active');
// 	$('body').removeClass('modal-active');
// 	$(window).off('resize', modalOverflowCheck);
// 	$(document).off('click', outsideClick);
// 	$(document).off('keyup', escapePress);

// 	setTimeout(function(){
// 		$('body').removeClass('modal-overflow');
// 	},300);

// 	if($modal.find('video').length){
// 		$modal.find('video').get(0).pause();
// 	}
// }

// function modalOverflowCheck(){
// 	if($('.modal.active .window').outerHeight() + 40 > $('.modal').outerHeight()){
// 		$('body').addClass('modal-overflow');
// 	}else{
// 		$('body').removeClass('modal-overflow');
// 	}
// }

// function outsideClick(event){
// 	var $target = $(event.target);
// 	if(!$target.closest('.modal.active .window').length) {
// 		closeModal();
// 	}
// }

// function escapePress(event){
// 	if (event.keyCode === 27) {
// 		closeModal();
// 	}
// }

// $('.close-modal').on('click', closeModal);

// $('*[data-modal]').on('click', openModal);

// $('*[href="#modal-id"]').on('click', function(){
// 	openModal('#modal-name');
// })

/*
* >>========================================>
* Accordion
* >>========================================>
*/

// $('.accordion').each(function(){
// 	var $accordion = $(this),
// 		$trigger = $accordion.find('.accordion-trigger'),
// 		$content = $accordion.find('.accordion-content'),
// 		$content_container = $content.find('> div'),
// 		accordionActive = false;

// 	$trigger.on('click', function(){
// 		var content_height = $content_container.outerHeight();

// 		$accordion.parent().find('.accordion.active').not($accordion).find('.trigger').trigger('click')

// 		if(!accordionActive){
// 			accordionActive = true;
// 			$accordion.addClass('active');
			
// 			var start_height = $content.outerHeight();

// 			TweenMax.killTweensOf($content).fromTo($content, .3, {height: start_height}, {height: content_height, ease:Power1.easeInOut, onComplete:function(){
// 				$content.attr('style', '').addClass('expanded');
// 			}});
			
// 		}else{
// 			accordionActive = false;
// 			$accordion.removeClass('active');
			
// 			var start_height = $content.outerHeight();
//             console.log('test')
// 			$content.removeClass('expanded');
// 			TweenMax.killTweensOf($content).fromTo($content, .3, {height: start_height}, {height: 0, ease:Power1.easeInOut});
// 		}
// 	})
// });

/*
* >>========================================>
* Hash Jump
* >>========================================>
*/

// $("a[href*='#']:not([data-modal])").on('click', function(event){
// 	if (/#/.test(this.href)) {
// 		var url = $(this).attr('href');
// 		var hash = url.substring(url.indexOf('#'));
// 		var $element = $(hash);

// 		if($element.length){
// 			if(history.pushState) {
// 				history.pushState(null, null, hash);
// 			}
// 			event.preventDefault();
// 			hashJump($element);
// 			$('body').removeClass('menu-active');
// 		}
// 	}
// });

// $(window).on('load', function(){
// 	if(window.location.hash) {
// 		if($(window.location.hash).length) {
// 			window.scrollTo(0, 0);
			
// 			setTimeout(function(){
// 				hashJump($(window.location.hash));
// 			}, 150)
// 		}
// 	}
// })

// function hashJump($target){
//     var offset = $('#main-header').outerHeight(true);

// 	TweenMax.to('html,body', .6, {scrollTop: $target.offset().top - offset, ease:Power3.easeInOut});	
// }