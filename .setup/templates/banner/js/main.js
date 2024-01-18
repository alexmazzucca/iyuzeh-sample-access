/*
* >>========================================>
* Scolling ISI
* >>========================================>
*/

var DivElmnt = document.getElementById("isi");
DivElmnt.scrollTop = 0;

var ScrollRate = 100;
var initialDelay;
var PreviousScrollTop  = 0;
var ReachedMaxScroll = false;
var ScrollInterval;

function scrollDiv_init() {
	initialDelay = setTimeout(function(){
		ScrollInterval = setInterval('scrollDiv()', ScrollRate);
	}, 500);

	DivElmnt.addEventListener("ontouchmove", pauseDiv, false);
	DivElmnt.addEventListener("mouseenter", pauseDiv, false);
	DivElmnt.addEventListener("mouseleave", resumeDiv, false);
}

function scrollDiv() {
	if (!ReachedMaxScroll) {
		DivElmnt.scrollTop = PreviousScrollTop;
		PreviousScrollTop++;
		ReachedMaxScroll = DivElmnt.scrollTop >= (DivElmnt.scrollHeight - DivElmnt.offsetHeight);
	}
}

function pauseDiv() {
	clearTimeout(initialDelay);
	clearInterval(ScrollInterval);
}

function resumeDiv() {
	PreviousScrollTop = DivElmnt.scrollTop;
	ScrollInterval    = setInterval('scrollDiv()', ScrollRate);
}

/*
* >>========================================>
* Banner Animation
* >>========================================>
*/

var bannerAnimation = new TimelineLite({paused:true});

bannerAnimation
	.fromTo('#object', .6, {opacity: 0}, {opacity: 1, delay: .5, ease: Linear.easeNone})