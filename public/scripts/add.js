'use strict';
console.log("Скрипт загружен");
var currentID = 0;
$(function() {

    $(".info").dblclick(function(){
       currentID = $(this).find("#id").text();
       var cod = $(this).find("#cod").text();
       var dir = $(this).find("#dir").text();
       $("#oldCode").val(cod);
       $("#oldName").val(dir);
       $(".update").css('display', 'grid');
       $("table").css('opacity', '0.5');

    });

    $(".saveButton").click(function(){
        var code =  $("#oldCode").val();
        var name =  $("#oldName").val();

        if(!(code.trim() == '' || name.trim() == '')){
            $.ajax({
                type:"POST",
                url:'/changeDirection',
                data:{code:code,name:name,id:currentID},
                success: function(result){
                if(result)
                  location.reload();
                  alert("Готово!"); },
                error: function(){
                    alert("Ошибка!");
                }
        });
            $(".update").css('display', 'none');
            $("table").css('opacity', '1');

        }else{
            $("#oldCode").css('box-shadow', '0 0 10px red');
            $("#oldName").css('box-shadow', '0 0 10px red');
        }
       
     });


    $("#add").click(function(){
        $("#code").val("");
        $("#name").val("");
        $(".add").css('display', 'grid');
        $("table").css('opacity', '0.5');
     });

    $(".addButton").click(function(){
        var code =  $("#code").val();
        var name =  $("#name").val();

        if(!(code.trim() == '' || name.trim() == '')){
            $.ajax({
                type:"POST",
                url:'/addDirection',
                data:{code:code,name:name},
                success: function(result){
                if(result)
                  location.reload();
                  alert("Готово!"); },
                error: function(){
                    alert("Ошибка!");
                }
        });
            $(".add").css('display', 'none');
            $("table").css('opacity', '1');

        }else{
            $("#code").css('box-shadow', '0 0 10px red');
            $("#name").css('box-shadow', '0 0 10px red');
        }
       
     });

    $(".cancel").click(function(){
        $(".add").css('display', 'none');
        $("table").css('opacity', '1');
     });
     
     $(".cancelChange").click(function(){
        $(".update").css('display', 'none');
        $("table").css('opacity', '1');
     });

     $(".info").click(function(){
        var row = $(this);
         if($(this).css('background-color')=='rgb(255, 255, 255)'){   
            $(this).css('background-color', 'rgb(230, 230, 230)');
         }else{
            $(this).css('background-color', 'rgb(255, 255, 255)');
         }

         $("#del").click(function(){
            if(row.css('background-color')=='rgb(230, 230, 230)'){
                 $.ajax({
                type:"POST",
                url:'/deleteDirection',
                data:{id:row.find("#id").text()},
                success: function(result){
                if(result)
                  location.reload();
                    alert("Готово!"); },
                error: function(){
                    alert("Ошибка!");
                }
        });
            }
        });
     });
     


});