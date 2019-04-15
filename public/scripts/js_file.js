$(document).ready(function(){

$("#sup").submit(function() {
	
	$(this).ajaxSubmit({

		error: function(xhr) {
        status('Error: ' + xhr.status);
            },
		success: function(spec){
				if (spec==0) alert("Выберите направление подготовки!")
				else {
		        var isAllowed = confirm("Вы уверены, что хотите добавить (перезаписать) "+
		        	"учебный план '"+spec+" года'?")
		        if (isAllowed) {
		        	$.ajax({
					type: "POST",
					url: "/load/sub",
					success: function(msg){
						alert(msg)	
					}
					});
		        }

		        }
		    }
		    
	});
	return false;
	});

$("#year_change").change(function() {
	ch()
});

$("#dis_change").change(function() {
	ch()
});

var ch = function() {
	var y =  $("#year_change option:selected").text();
	var d = $("#dis_change option:selected").text();
	if (d!="Выберите направление" && y!="Выберите год начала обучения")  
	  $.ajax({
		type: "POST",
		url: "/up/show",
		data: {
			year: y, 
			dir:d
		},
		success: function(rows){
			$("#table").html("")
			if (rows[0]==undefined) str="Hе найдено" 
			else {
				var str= "<table  class='table'>";
				str+="<thead><tr><th scope='col'>Семестр</th><th scope='col'>Дисциплина</th><th scope='col'>Лекций/нед</th><th scope='col'>Практик/нед</th><th scope='col'>Лаб/нед</th><th scope='col'>Тип контроля</th></tr></thead>"
				str+="<tbody>"
				for(var i = 0; i<rows.length; i++) {
					str+="<tr scope='row'><td>"+rows[i].sem+"</td><td>"+rows[i].dis+"</td><td>"+rows[i].lek+"</td><td>"+rows[i].pr+"</td><td>"+rows[i].lab+"</td><td>"+rows[i].control+"</td></tr>"
				}
				str+="</tbody></table>"
			}
			$("#table").html(str)
		}
		});
}

$('.d option').hover(function(){
	$($(this)).addClass('selectOption');
},function(){});
});




	



