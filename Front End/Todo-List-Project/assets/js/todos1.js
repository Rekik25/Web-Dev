//check off specific todos by clicking
$("ul").on("click", "li", function (){
    $(this).toggleClass("completed");  
});
//click on x to delete ToDo
$("ul").on("click", "span", function(event){
    $(this).parent().fadeOut(function(){
        $(this).remove();
    });
    event.stopPropagation();//stops the bubbling up
});
$("input[type='text']").keypress(function(event){
    if(event.which === 13){
        var todoText = $(this).val();
        $(this).val("");// to clear after enter
        $("ul").append("<li><span><i class= 'fa fa-trash' aria-hidden='true'></i></span> "+ todoText + "</li>");
    }
});
$(".fa-plus").click(function(){
    $("input[type='text']").fadeToggle();
});