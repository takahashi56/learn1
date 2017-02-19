$(document).ready(function() {

    var currentStep;
    var lastStep = 5;
    var headerHeight = 60;
    var iframeHeight = $(window).height() - headerHeight;

    if (localStorage.getItem("currentStep") === null) {
        localStorage.setItem('currentStep', 1);
        currentStep = 1;
    } else {
        currentStep = parseInt(localStorage.getItem("currentStep"));
    }

    if (currentStep == 1) {
        $(".section_div .iframe-controls_prev").fadeOut(200);
    }
    if (currentStep == lastStep) {
        $(".section_div .iframe-controls_next").fadeOut(200);
    }

    $(".section_div .iframe-container-inner iframe").css("height", iframeHeight+"px").attr("src", "slide"+currentStep+".html");
    $(".section_div .iframe-container-inner iframe").fadeIn(200);

    $(".section_div .iframe-controls_prev").on("click", function(e){
        e.preventDefault();

        currentStep = currentStep - 1;
        localStorage.setItem('currentStep', currentStep);

        if (currentStep == 1) {
            $(".section_div .iframe-controls_prev").fadeOut(50);
        }
        if (currentStep == lastStep) {
            $(".section_div .iframe-controls_next").fadeOut(50);
        }

        $(".section_div .iframe-container-inner iframe").fadeOut(150, function(){
            $(".section_div .iframe-container-inner iframe").attr("src", "slide"+currentStep+".html");
            $(".section_div .iframe-container-inner iframe").fadeIn(200);
        });

        $(".section_div .iframe-controls_next").fadeIn(200);

        $(".section_div .iframe-progress span").css("width", currentStep/lastStep*100+"%");
    });

    $(".section_div .iframe-controls_next").on("click", function(e){
        e.preventDefault();

        currentStep = currentStep + 1;
        localStorage.setItem('currentStep', currentStep);

        if (currentStep == 1) {
            $(".section_div .iframe-controls_prev").fadeOut(50);
        }
        if (currentStep == lastStep) {
            $(".section_div .iframe-controls_next").fadeOut(50);
        }

        $(".section_div .iframe-container-inner iframe").fadeOut(150, function(){
            $(".section_div .iframe-container-inner iframe").attr("src", "slide"+currentStep+".html");
            $(".section_div .iframe-container-inner iframe").fadeIn(200);
        });

        $(".section_div .iframe-controls_prev").fadeIn(200);

        $(".section_div .iframe-progress span").css("width", currentStep/lastStep*100+"%");
    });

    $(window).resize(function(){
        //headerHeight = 60;
        iframeHeight = $(window).height() - headerHeight;
        $(".section_div .iframe-container-inner iframe").css("height", iframeHeight+"px");
    });

});