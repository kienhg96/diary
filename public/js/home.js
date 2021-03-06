var sendding = false;
var loaded = {};

function generateContent(no, title, date, content, id, style = ""){
	return '<div class="well" id="'+id+'" ' + style +'>' + 
				'<h3 class="title">#' + no + ' ' + title +'</h3>' +
				'<span class="time">&#x1f550; '+ date +'</span><hr>' +
				'<p class="para">'+ content + '</p><hr class="secondhr">' + 
				'<div class="commentarea">' +
					'<div class="cmtmsg">' + 
					'</div>' +
					'<input type="text" name="commentbox" class="form-control cmtbox" placeholder="Để lại một bình luận...">' +
				'</div>' +
				'<button class="btn btn-info btncomment"><i class="fa fa-comment"></i> Bình luận</button>' +
				'<button class="btn cmtcollapse"><i class="fa fa fa-arrow-up"></i></button>' +
				'<button class="btn btn-danger btndelete" name="delete"><i class="fa fa-trash"></i> Xóa #' + no + '</button>'+
			'</div>';
}

function makeCmt(date, msg){
	return '<h6><span class="date">'+ date +'</span> : ' + msg +'</h6>';
}

function getDateString(){
	var date = new Date();
	var minutes = date.getMinutes()
	var datestr = date.getHours() + "<b>:</b>" + (minutes < 10 ? ("0" + minutes) : (minutes)) + " " + date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
	return datestr;
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
	$(this).html('<img id="imgbtnloading" src="public/gif/loading.gif"></i> Đang xóa...');
	$(this).prop('disabled', true);
	$.post(window.location.origin + '/post',
	{
		'action' : 'delete',
		'id' : parent.attr('id')
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

function sendCmt(id, msg, date, callback){
	$.post(window.location.origin + '/post', {
		'action': 'sendCmt',
		'id': id,
		'msg': msg,
		'date': date
	}, callback);
}
function getCmt(id, callback){
	$.post(window.location.origin + '/post', {
		'action' : 'getCmt',
		'id' : id
	}, callback);
}


$(document).ready(function(){

	var textarea = document.querySelector('textarea');
	textarea.addEventListener('keydown', autosize);
             
	function autosize(){
	  var el = this;
	  el
	  setTimeout(function(){
	    el.style.cssText = 'height:auto; padding:0';
	    // for box-sizing other than "content-box" use:
	    // el.style.cssText = '-moz-box-sizing:content-box';
	    el.style.cssText = 'height:' + (el.scrollHeight + 15)+ 'px';
	  },0);
}

	$.post(window.location.origin + '/post',
	{
		'action' : 'getContent'
	},
	function(data, status){
		//console.log(data);
		data.forEach(function(elem){
			loaded[elem.id] = false;
			var html = generateContent(i, elem.title, elem.date , elem.content, elem.id);
			$("#content").prepend(html);
			i++;
		});
		$(".btndelete").on('click', deletepost);
		updateEvent();
		$('#loading').hide('slow');
		$('#content').show('slow');
	});
	
	// Auto expand

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
		if ((subject === '') || (contentText === '')){
			$('#notice').html('Bạn phải điền đủ 2 mục!');
			$('#notice').show('normal');
		}
		else {
			var date = new Date();
			var datestr = getDateString();
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
			//console.log(datestr);
			$("#submit").prop('disabled', true);
			$("#submit").html('<img id="imgbtnloading" src="public/gif/loading.gif"></i> Đang gửi...');
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
					loaded[data] = true;
					$("#content").prepend(html);
					i++;
					$(".btndelete").on('click', deletepost);
					$( "#" + data ).show( "slow", function() {
	    				// Animation complete.
	    				$("#submit").html('<i class="fa fa-paper-plane"></i> Gửi');
	    				$("#submit").prop('disabled', false);
	  				});
	  				$("#subject").val("");
					$("#textContent").val("");
	  				updateEvent();
				}
			});
		}
	});
	$('#notice').on('click', function(){
		$(this).hide('normal');
	});
	function btncomment() {
		$(".btncomment").on('click', function(){
			var cmt = $(this).parent().find('.commentarea');
			if (cmt.css('display') === 'none'){
				// Load comment
				//console.log($(this).parent().find('.commentarea').find('cmtmsg').html());
				var cmtmsg = $(this).parent().find('.commentarea').find('.cmtmsg');
				var parent = $(this).parent();
				var id = $(this).parent().attr('id');
				//console.log(id + " " + loaded.id)
				var thisbtn = $(this);
				if (loaded[id] === false){
					thisbtn.html('<img id="imgbtnloading" src="public/gif/loading.gif"></i> Đang tải...');
					thisbtn.prop('disabled', true);
					getCmt(id, function(data, status){
						data.forEach(function(elem){
							//console.log(makeCmt(elem.date, elem.msg));
							cmtmsg.append(makeCmt(elem.date, elem.msg));
						});
						cmt.show('normal');
						parent.find('.cmtcollapse').show('normal');
						//console.log('done');
						thisbtn.prop('disabled', false);
						thisbtn.html('<i class="fa fa-comment"></i> Bình luận');
						sendding = false;
						loaded[id] = true;
					});
				}
				else {
					cmt.show('normal');
					parent.find('.cmtcollapse').show('normal');
				}
				// End loadcomment
			}
			else {
				var parent = $(this).parent();
				// Send comment to server
				var msg = parent.find('.commentarea').find('.cmtbox').val();
				if (msg != '' && sendding === false){
					sendding = true;
					$(this).prop('disabled', true);
					$(this).html('<img id="imgbtnloading" src="public/gif/loading.gif"></i> Đang gửi...');
					var datestr = getDateString();
					var thisbtn = $(this);
					var id = parent.attr('id');
					sendCmt(id, msg, datestr ,function(data, status){
						if (status === 'success'){
							var str = '<h6 style="display: none;"><span class="date">'+ datestr +'</span> : ' + msg +'</h6>';
							//console.log(str);
							parent.find('.commentarea').find('.cmtbox').val('');
							parent.find('.commentarea').find('.cmtmsg').append(str);
							parent.find('.commentarea').find('.cmtmsg').find('h6').show('fast');
							thisbtn.prop('disabled', false);
							thisbtn.html('<i class="fa fa-comment"></i> Bình luận');
						}
						sendding = false;
					})
				}
			}
		});
	}
	btncomment();
	function btncmtcllapse(){
		$('.cmtcollapse').on('click', function(){
			$(this).parent().find('.commentarea').hide('fast');
			$(this).hide('fast');
		});
	}
	btncmtcllapse();
	function cmtEnter(){
		$(".cmtbox").keyup(function(e){
			if (e.keyCode == 13){
				var cmtbox = $(this);
				var msg = cmtbox.val();
				var thisbtn = $(this).parent().parent().find('.btncomment');
				var id = $(this).parent().parent().attr('id');
				thisbtn.prop('disabled', true);
				thisbtn.html('<img id="imgbtnloading" src="public/gif/loading.gif"></i> Đang gửi...');
				// Send comment to server
				var datestr = getDateString();
				sendCmt(id, msg, datestr,function(data, status){
					if (status === 'success'){
						var str = '<h6 style="display: none;"><span class="date">'+ datestr +'</span> : ' + msg +'</h6>';
						//console.log(str);
						cmtbox.val('');
						cmtbox.parent().find('.cmtmsg').append(str);
						cmtbox.parent().find('.cmtmsg').find('h6').show('fast');
						thisbtn.prop('disabled', false);
						thisbtn.html('<i class="fa fa-comment"></i> Bình luận');
					}
				});
			}
		});
	}
	cmtEnter();
	function updateEvent(){
		cmtEnter();
		btncmtcllapse();
		btncomment();
	}
});