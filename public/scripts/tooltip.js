'use strict tooltip';
console.log("Скрипт загружен");
$(function() {
    $("#del").mouseover(function(e){

        var tooltip = $(this).attr("data-tooltip");
        /*
        var elem = $("#del").append("<p>"+tooltip+"</p>");
        elem.addClass('tooltip');
        var coords = this.getBoundingClientRect();
        var left = coords.left + (this.offsetWidth - elem.offsetWidth) / 2;
        if (left < 0) left = 0; 
  
        var top = coords.top - elem.offsetHeight - 5;
        if (top < 0) { 
          top = coords.top + this.offsetHeight + 5;
        }
  
        $(".tooltip").css('left', left+'px');
        $(".tooltip").css('top', top+'px');
        */
    });
    $("#del").mouseout(function(e){
   
    });
});