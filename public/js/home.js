function generateContent(no, title, content){
	return '<div class="well"><h3 class="title">#' + no + ' ' + title +'</h3><hr><p class="para">'+ content + '</p><button class="btn btn-danger" type="submit" name="delete" value="12"><i class="fa fa-trash"></i> Xóa #' + no + '</button></div>';
}
var i = 1;
$(document).ready(function(){
	$.post(window.location.origin + '/post',
	{
		'action' : 'getContent'
	},
	function(data, status){
		console.log(data);
		data.forEach(function(elem){
			var html = generateContent(i, elem.title, elem.content);
			$("#content").prepend(html);
			i++;
		});
	});
	$("#submit").on('click', function(){
		var subject = $("#subject").val();
		var contentText = $("#textContent").val();

		$.post(window.location.origin + '/post', 
		{
			'action' : 'post',
			'title' : subject,
			'content' : contentText
		}, 
		function(data, status){
			if (status=== "success"){
				var html = generateContent(i, subject, contentText);
				$("#content").prepend(html);
				i++;
			}
		});

	});
});