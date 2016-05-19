function generateContent(no, title, content, id, style){
	return '<div class="well" id="'+id+'" ' + style +'><h3 class="title">#' + no + ' ' + title +'</h3><hr><p class="para">'+ content + '</p><button class="btn btn-danger btndelete" type="submit" name="delete" value="'+ id +'"><i class="fa fa-trash"></i> Xóa #' + no + '</button></div>';
}
var i = 1;

function deletepost(){
	/*
	$(this).parent().animate({
		height: 0,
		'padding-top': 0,
		'padding-bottom': 0
	}, function(){
		$(this).remove();
	});*/
	$(this).parent().hide('slow', function(){
		$(this).remove();
	});
	var parent = $(this).parent();
	$.post(window.location.origin + '/post',
	{
		'action' : 'delete',
		'id' : $(this).attr('value')
	},
	function(data, status){
		//console.log(status);
		if (status=== "success"){
			parent.hide('slow', function(){
				$(this).remove();
			});
		}
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
			var html = generateContent(i, elem.title, elem.content, elem.id, "");
			$("#content").prepend(html);
			i++;
		});
		$(".btndelete").on('click', deletepost);
	});
	$("#submit").on('click', function(){
		var subject = $("#subject").val();
		var contentText = $("#textContent").val();
		$("#subject").val("");
		$("#textContent").val("");
		$("#submit").prop('disabled', true);
		$("#submit").html('<i class="fa fa-paper-plane"></i> Đang gửi...');
		$.post(window.location.origin + '/post', 
		{
			'action' : 'post',
			'title' : subject,
			'content' : contentText
		}, 
		function(data, status){
			if (status=== "success"){
				var html = generateContent(i, subject, contentText, data, 'style="display: none;"');
				$("#content").prepend(html);
				i++;
				$(".btndelete").on('click', deletepost);
				$( "#" + data ).show( "slow", function() {
    				// Animation complete.
    				$("#submit").html('<i class="fa fa-paper-plane"></i> Gửi');
    				$("#submit").prop('disabled', false);
  				});
			}
		});
	});
});