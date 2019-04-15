'use strict';
$( document ).ready(function() {
    //Add new group
    $('.block__line-add').click(function(){
        $("#field-code").val("");
        $("#field-name").val("");
        //download directions
        $.ajax({
            url:'/getAllDir',
            success: function(result){
                var str = '<option value="0" > Выберите направление</option>'+ '\n';
                for(var i=0;i<result.length;i++){
                    str += '<option value="'+result[i].id+'">'+result[i].direction+'</option>' + '\n';
                }
                $('#sel1').html(str);
            }
        });
        $(".block__add").fadeIn();
        $("table").css('opacity', '0.5');
        
    });

    $(".button-add").click(function(){
        var year =  $("#field-code").val();
        var name =  $("#field-name").val();
        var dir = $("#sel1 option:selected").val();
        if(year.trim() != '' && name.trim() != '' && dir != 0){
            $.ajax({
                type:"POST",
                url:'/addGroup',
                data:{year:year, name:name, id:dir},
                success: function(result){
                var str = '';
                if(result)
                $('.table_body').html("");
                    for(let i = 0; i < result.length;i++ ){
                        str += '<tr class="info"><th id="info-id">'+ result[i].id + '</th><th id="info-year">'+ result[i].year +'</th><th id="info-code">'+ result[i].name +'</th><th id="info-dir">'+ result[i].direction +'</th></tr>';
                    }
                    $('.table_body').append(str);
                    $( ".info" ).on( "click", selectClick);
                    $( ".info" ).on( "mouseout", exHover);
                    $( ".info" ).on( "mouseover", startHover);
                    alert("Готово!"); },
                error: function(){
                    alert("Ошибка!");
                }
            });
            $(".block__add").fadeOut();
            $("table").css('opacity', '1');

        }
       
     });

    //Cancel
    $(".button__cancel-add").click(function(){
        $(".block__add").fadeOut();
        $("table").css('opacity', '1');
    });
    $(".button__cancel-save").click(function(){
        $(".block__update").fadeOut();
        $("table").css('opacity', '1');
    });

    $('.info').hover(startHover,exHover);
    function startHover(event){
        var self = $(this);
        $(self).css('background-color','#abb8f1');
    }
    function exHover(event){
        var self = $(this);
        if(!$(self).hasClass("clicked")){
            $(self).css('background-color','white');
    }}
    $('.info').click(selectClick);
    function selectClick(event){
        var self = $(this);
        if($(self).hasClass("clicked")){
            $(self).css('background-color','white');
            $($(this)).removeClass("clicked");
        }
        else{
            $($(this)).css('background-color','#abb8f1');
            $($(this)).addClass("clicked");
        }
    }

    //Delete group
    $('.block__line-del').click(function(event){
        var data = $('.clicked');
        var str = '';
        var index = [];

        for(let i = 0; i < data.length; i++){
            var children = $(data[i]).children();
            index.push({"id":children[0].innerHTML});
            str += children[0].innerHTML+' '+children[1].innerHTML+' '+children[2].innerHTML +' '+ children[3].innerHTML +'\n';
        }
        if(index.length != 0){
            var conf = confirm(str + "Вы действительно хотите удалить запись?");

            if (conf) {
			    $.ajax({
                    type:"POST",
                    url:'/deleteGroup',
                    contentType: 'application/json',
                    dataType: 'json',
                    data:JSON.stringify(index),
                    success: function(result){
                        $('.table_body').html("");
                        str = '';
                        if(result)
                            for(let i = 0; i < result.length;i++ ){
                                str += '<tr class="info"><th id="info-id">'+ result[i].id + '</th><th id="info-year">'+ result[i].year +'</th><th id="info-code">'+ result[i].name +'</th><th id="info-dir">'+ result[i].direction +'</th></tr>';
                            }
                            $('.table_body').append(str);
                            $( ".info" ).on( "click", selectClick);
                            $( ".info" ).on( "mouseout", exHover);
                            $( ".info" ).on( "mouseover", startHover);
                            alert("Готово!"); },
                    error: function(){
                        alert("Ошибка!");
                }
        });
        }
        }
        
    });

     //Update direction
     var current_id = -1;
     $('.block__line-update').click(function(event){
         var data = $('.clicked');
 
         if(data.length != 0){
            current_id = $(data[0]).children()[0].innerHTML;
            $("#field__currernt-code").val($(data[0]).children()[1].innerHTML);
            $("#field__currernt-name").val($(data[0]).children()[2].innerHTML);
            var dir = $(data[0]).children()[3].innerHTML;

            $.ajax({
                url:'/getAllDir',
                success: function(result){
                    var str = '<option value="0" > Выберите направление</option>'+ '\n';
                    for(var i=0; i<result.length; i++){
                        if(result[i].direction == dir)
                            str += '<option selected value="'+result[i].id+'">'+result[i].direction+'</option>' + '\n';
                        else
                            str += '<option value="'+result[i].id+'">'+result[i].direction+'</option>'+ '\n';
                    }
                    $('#field__currernt-direction').html(str);
                }
            });
            $(".block__update").fadeIn();
            $("table").css('opacity', '0.5');
         }
         
     });
     $('.button__save').click(function(){
        var year =  $("#field__currernt-code").val();
        var name =  $("#field__currernt-name").val();
        var dir = $("#field__currernt-direction option:selected").val();
        if(year.trim() != '' && name.trim() != '' && dir != 0){
             $.ajax({
                 type:"POST",
                 url:'/changeGroup',
                 data:{id: current_id, year:year, name:name, dir:dir},
                 success: function(result){
                 var str = '';
                 if(result)
                 $('.table_body').html("");
                     for(let i = 0; i < result.length;i++ ){
                        str += '<tr class="info"><th id="info-id">'+ result[i].id + '</th><th id="info-year">'+ result[i].year +'</th><th id="info-code">'+ result[i].name +'</th><th id="info-dir">'+ result[i].direction +'</th></tr>';
                    }
                     $('.table_body').append(str);
                     $( ".info" ).on( "click", selectClick);
                     $( ".info" ).on( "mouseout", exHover);
                     $( ".info" ).on( "mouseover", startHover);
                     alert("Готово!"); },
                 error: function(){
                     alert("Ошибка!");
                 }
             });
             $(".block__update").fadeOut();
             $("table").css('opacity', '1');
         }
     })
});