$(function() {

	//delete confirmation
	$(document).on('click', '.delete', function () {
		var del = confirm("Вы действительно хотите удалить запись?")
		
		if (del) {
			var id = $(this).attr("id")
			console.log(id)
			$.ajax({
	      		type: "POST",
	      		url: "/deletenote",
	      		data: {id:id},
	      		success: function(msg) {
	      			 document.location.href = "/profile";
	      		}
	      	})
		}
	})

	$(document).on('click', '.edit', function () {	
		$("#Textarea1").val("")
		$("#createform").fadeIn();	
		var id = $(this).attr("id")
		$.ajax({
	      		type: "POST",
	      		url: "/getnote",
	      		data: {id:id},
	      		success: function(msg) {
	      			 $("#Textarea1").val(msg.rows[0].text)
	      			 console.log(id)
	      			 $("#Textarea1").addClass(id)
	      			 if (msg.aud!=null) {
	      			 	$(".all").prop('checked', false)
						$("#all").prop('checked', false)

						$all = $(".all");
						
						for (var i=0; i<msg.aud.length; i++) {
							$('[value='+msg.aud[i].group_id+']').prop('checked', true)
						}
	      			 }
	      			 else {
	      			 	$(".all").prop('checked', true)
						$("#all").prop('checked', true)
	      			 }

	      		}
	      	})
		
	})



	$("#create").click(function(){
		$("#Textarea1").val("")
		$("#createform").fadeIn();
		$(".all").prop('checked', true)
		$("#all").prop('checked', true)	
	})

	$("#cancel").click(function(){
		$("#createform").fadeOut();
	})

	$("#subm").click(function(){
		$("#createform").fadeOut();	

		var classes = $("#Textarea1").attr('class').split(/\s+/)
		console.log(classes)

		var ch = []
			$all = $(".all");
			if ($("#all").prop('checked')) ch.push("all");
			else {
				for (var i=0; i<$all.length; i++)
					if ($($all[i]).prop('checked'))
						ch.push($($all[i]).val())
			}

		if ($("#Textarea1").val()!="" && ch[0])
		if (classes.length==2) {
			$(".not#"+parseInt(classes[1])+" > .mess").html($("#Textarea1").val())
			$("#Textarea1").removeClass(parseInt(classes[1]))
			$.ajax({
		      type: "POST",
		      url: "/editsubmitmess",
		      data: {f:ch, text: $("#Textarea1").val(), id:parseInt(classes[1])},
		      success: function(msg) {
		      	}
    		});
		}
		else {
			$.ajax({
		      type: "POST",
		      url: "/submitmess",
		      data: {f:ch, text: $("#Textarea1").val()},
		      success: function(msg) {
		      	var notes = $("#container").html();
		      	notes = "<div class='not' id='"+msg.id_c+"'><p class='delete' id='"+msg.id_c+"'>Удалить</p><p class='edit' id='"+msg.id_c+"'>Редактировать</p><p class='mess'>"+msg.message+"</p><p class='auth'>"+msg.auth+"</p><p class='time'>"+msg.time+"</p></div>" + notes
		      	$("#container").html(notes)
		      	}
    		});
		}
		
		

	})


	$(document).on('change', 'input[type=checkbox]', function () {
  	if ($(this).attr("id")=="all" && !($(this).prop('checked')))
  		$(".all").prop('checked', false) 
  	if ($(this).attr("id")=="all" && ($(this).prop('checked')))
  		$(".all").prop('checked', true)
  	if ($(this).hasClass("all") && !($(this).prop('checked')))
  		$("#all").prop('checked', false)
});

	
})