'use strict';
console.log("Скрипт загружен");
$(function() {

   //Add new user
   $('.block__line-add').click(function(){
        $("#field-surname").val("");
        $("#field-name").val("");
        $("#field-fathername").val("");
        //download groups
    
        $(".block__add").fadeIn();
        $("table").css('opacity', '0.5');
    
    });


    //Delet user
   $('.block__line-del').click(function(){
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
            if (conf) {}
        }
    
    });


    //Add group of students
   $('.block__line-download').click(function(){
        $(".block__download").fadeIn();
        $("table").css('opacity', '0.5');
    
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
    $(".button__cancel-download").click(function(){
        $(".block__download").fadeOut();
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

    //Update user
    //Update direction
    var current_id = -1;
    $('.block__line-update').click(function(event){
        var data = $('.clicked');
 
         if(data.length != 0){
            current_id = $(data[0]).children()[0].innerHTML;
            $("#field__current-surname").val($(data[0]).children()[1].innerHTML);
            $("#field__current-name").val($(data[0]).children()[2].innerHTML);
            $("#field__current-fathername").val($(data[0]).children()[3].innerHTML);

            $(".block__update").fadeIn();
            $("table").css('opacity', '0.5');
         }
    });

});