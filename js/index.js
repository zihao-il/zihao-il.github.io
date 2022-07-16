$(document).ready(function() {
	$(".nav-item").click(function() {
		if ($(window).width() < 992) {
			var myCollapse = document.getElementById('site-menu')
			var bsCollapse = new bootstrap.Collapse(myCollapse, {
				hide: true
			});
		};

	});

});
