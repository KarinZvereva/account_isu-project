$(document).ready(function(){


$("#group_change").change(function() {
	$("#table").html("");
	$("#submarks").hide();
	var y =  $("#group_change option:selected").text();
	$("#dis_change").html("<option disabled selected>Выберите дисциплину</option>");
	$.ajax({
		type: "POST",
		url: "/marks/sem",
		data: {
			group: y
		},
		success: function(rows){
			if (rows[0]) {
				str = "<option disabled selected>Выберите семестр</option>"
				for (var i=0; i<rows.length; i++)
					str+="<option>"+rows[i].sem+"</option>"
				$("#sem_change").html(str);
			}
			else {
				str = "<option disabled selected>Выберите семестр</option>"
				str+="<option disabled selected>Не найдено</option>"
				$("#sem_change").html(str);
			}
			
		}
		});

});

var dis = [];

$("#sem_change").change(function() {
	$("#table").html("");
	$("#submarks").hide();
	var y =  $("#group_change option:selected").text();
	var s =  $("#sem_change option:selected").text();

	if (y!="Выберите группу")
	$.ajax({
		type: "POST",
		url: "/marks/dis",
		data: {
			group: y,
			sem: s
		},
		success: function(rows){
			if (rows[0]) {
				str = "<option disabled selected>Выберите дисциплину</option>"
				for (var i=0; i<rows.length; i++) {
					str+="<option value="+rows[i].id+">"+rows[i].dis+"</option>"
					dis.push({"id":rows[i].id, "control":rows[i].control})
				}
				$("#dis_change").html(str);

			}
			else {
				str = "<option disabled selected>Выберите дисциплину</option>"
				str+="<option disabled selected>Не найдено</option>"
				$("#dis_change").html(str);
			}
			
		}
		});

});

$("#submarks").click(function() {
	var d =  $("#dis_change option:selected").val();
	var answer = []
	$input_m = $(".mark")
	$input_b = $(".balls")
	for (var i=0; i<$input_m.length; i++) {
		if (($($input_m[i]).val())!="" || ($($input_b[i]).val())!="") {
			var k = new Object();
			k.user = users[i].id;
			k.mark = $($input_m[i]).val();
			k.balls = $($input_b[i]).val();
			answer.push(k)
			//answer.push({"user":users[i].id, "mark":$($input_m[i]).val(), "balls": $($input_b[i]).val()})
		}
	}


	var c = new Object;
		
	$.ajax({
		type: "POST",
		url: "/marks/update",
		data: {
			dis: d,
			"marks": JSON.stringify(answer)			
		},
		success: function(msg){
			alert(msg)		
		}
		});

})

var users;

$("#dis_change").change(function() {
	var y =  $("#group_change option:selected").val();
	var d =  $("#dis_change option:selected").val();
	result = dis.filter(e => e.id==d)
	$("#table").html("<p>Форма контроля: "+result[0].control+"</p>")
	$.ajax({
		type: "POST",
		url: "/marks/m",
		data: {
			group: y,
			dis: d
		},
		success: function(rows){
			var str = $("#table").html();
			users = rows;
			if (rows[0]) {
				str+= "<table class='table'>";
				str+="<thead><tr><th>ФИО студента</th><th>Оценка</th><th>Баллы</th></tr></thead>"
				str+="<tbody>"
				for(var i = 0; i<rows.length; i++) {
					mark = (rows[i].mark==null) ? "" : rows[i].mark
					balls = (rows[i].balls==null) ? "" : rows[i].balls
					str+="<tr><td>"+rows[i].fio+"</td><td><input  class='form-control mark'  type='text' ' value='"+mark+"'/></td><td><input class='form-control balls' type='text'  value='"+balls+"'/></td></tr>"
				}
				str+="</tbody></table>"
				$("#table").html(str);
			$("#submarks").show();	

	 		}
	 	}
	});

});

});





	



