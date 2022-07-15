$(document).ready(function() {
	$(".nav-item").click(function() {
		var myCollapse = document.getElementById('site-menu')
		var bsCollapse = new bootstrap.Collapse(myCollapse, {
			hide: true
		});
	});

});
