function generateContent(no, title, content, id){
	return '<div class="well"><h3 class="title">#' + no + ' ' + title +'</h3><hr><p class="para">'+ content + '</p><button class="btn btn-danger btndelete" type="submit" name="delete" value="'+ id +'"><i class="fa fa-trash"></i> Xóa #' + no + '</button></div>';
}
var i = 1;

function deletepost(){
	$(this).parent().remove();
		$.post(window.location.origin + '/post',
		{
			'action' : 'delete',
			'id' : $(this).attr('value')
		},
		function(data, status){
			console.log(status);
	});
}

$(document).ready(function(){
	$.post(window.location.origin + '/post',
	{
		'action' : 'getContent'
	},
	function(data, status){
		//console.log(data);
		data.forEach(function(elem){
			var html = generateContent(i, elem.title, elem.content, elem.id);
			$("#content").prepend(html);
			i++;
		});
		$(".btndelete").on('click', deletepost);
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
				var html = generateContent(i, subject, contentText, data);
				$("#content").prepend(html);
				i++;
				$(".btndelete").on('click', deletepost);
			}
		});
	});
});