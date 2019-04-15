$(document).ready(function(){

var subjects;

$.ajax({
		type: "GET",
		url: "/subjects/sem",
		success: function(rows){
			if (rows=="login") document.location.href = "/login";
			else {
			s = rows.sem;
			y = rows.year;
			user = rows.id;
			dir = rows.dir;

			d = new Date();
			var semnumb = (d.getFullYear()-y)*2+1;
			if (d.getMonth()>=1 && d.getMonth()<=7) semnumb--
			console.log(semnumb)
			str = 0;
			for (var i=0; i<s.length; i++)
				if (s[i].sem==semnumb)
					str+="<option selected>"+s[i].sem+"</option>"
				else
					str+="<option>"+s[i].sem+"</option>"
			$("#sem_change").html(str);	
			 	$.ajax({
					type: "POST",
					url: "/subjects/sub",
					data: {
						user:user,
						dir:dir,
						year: y 			
					},
					success: function(msg){
						subjects = msg;
						createTable(semnumb)
					}
				});
			}


		}
		});

var createTable = function(semnumb) {
	result = subjects.filter(e=> e.sem==semnumb);
	var str= "<table class='table'>";
	str+="<thead><tr><th scope='col'>Дисциплина</th><th scope='col'>Лекций/нед</th><th scope='col'>Практик/нед</th><th scope='col'>Лаб/нед</th><th scope='col'>Тип контроля</th><th scope='col'>Оценка</th><th scope='col'>Баллы</th></tr></thead>"
	str+="<tbody>"
	for(var i = 0; i<result.length; i++) {
		mark = (result[i].mark==null) ? "" : result[i].mark
		balls = (result[i].balls==null) ? "" : result[i].balls
		if (result[i].choise==1)
		str+="<tr scope='row'><td class='curs'>"+result[i].dis+"</td><td>"+result[i].lek+"</td><td>"+result[i].pr+"</td><td>"+result[i].lab+"</td><td>"+result[i].control+"</td><td>"+mark+"</td><td>"+balls+"</td></tr>"
		else
		str+="<tr scope='row'><td>"+result[i].dis+"</td><td>"+result[i].lek+"</td><td>"+result[i].pr+"</td><td>"+result[i].lab+"</td><td>"+result[i].control+"</td><td>"+mark+"</td><td>"+balls+"</td></tr>"
	}
	str+="</tbody></table>"
	$("#table").html(str);	
}


$("#sem_change").change(function() {
	createTable($("#sem_change option:selected").text())

})


});





	



