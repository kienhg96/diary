function generateContent(no, title, date, content, id, style){
	return '<div class="well" id="'+id+'" ' + style +'>\
				<h3 class="title">#' + no + ' ' + title +'</h3>\
				<span class="time">&#x1f550; '+ date +'</span><hr>\
				<p class="para">'+ content + '</p>\
				<button class="btn btn-danger btndelete" type="submit" name="delete" value="'+ id +'"><i class="fa fa-trash"></i> Xóa #' + no + '</button>\
			</div>';
}
var i = 1;
var collapse = true;
function deletepost(){
	/*
	$(this).parent().animate({
		height: 0,
		'padding-top': 0,
		'padding-bottom': 0
	}, function(){
		$(this).remove();
	});*/
	var parent = $(this).parent();
	$.post(window.location.origin + '/post',
	{
		'action' : 'delete',
		'id' : $(this).attr('value')
	},
	function(data, status){
		console.log(status);
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
			var html = generateContent(i, elem.title, elem.date , elem.content, elem.id, "");
			$("#content").prepend(html);
			i++;
		});
		$(".btndelete").on('click', deletepost);
	});

	$("#subject").on('click', function(){
		if (collapse){
			$(this).animate({
				'width': '100%'
			});
			$("#boxContent").show('normal');
			collapse = false;
		}
	});

	$("#collapse").on('click', function(){
		$("#subject").animate({
			'width': '200px'
		}, function(){
		});
		$("#boxContent").hide('normal');
		collapse = true;
	});

	$("#submit").on('click', function(){
		var subject = $("#subject").val();
		var contentText = $("#textContent").val();
		var date = new Date();
		var minutes = date.getMinutes()
		var datestr = date.getHours() + "<b>:</b>" + (minutes < 10 ? ("0" + minutes) : (minutes)) + " " + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
		var timezone = -date.getTimezoneOffset() / 60;
		minutes = (timezone - Math.floor(timezone))*60;
		var timezonestr = Math.floor(timezone) + "<b>:</b>" + (minutes < 10 ? ("0" + minutes) : (minutes));
		if (timezone >= 0){
			timezonestr = " UTC +" + timezonestr;
		}
		else {
			timezonestr = " UTC +" - timezonestr;
		}
		datestr += timezonestr
		console.log(datestr);
		$("#subject").val("");
		$("#textContent").val("");
		$("#submit").prop('disabled', true);
		$("#submit").html('<i class="fa fa-paper-plane"></i> Đang gửi...');
		$.post(window.location.origin + '/post', 
		{
			'action' : 'post',
			'title' : subject,
			'content' : contentText,
			'date' : datestr
		}, 
		function(data, status){
			if (status=== "success"){
				var html = generateContent(i, subject, datestr ,contentText, data, 'style="display: none;"');
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