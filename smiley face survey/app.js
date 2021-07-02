var button_top = document.querySelectorAll(".top_emoji");
for (var i = 0; i < button_top.length; i++)  {

    button_top[i].onclick = function() {
    document.getElementById("body_top").style.display = "none";
    document.getElementById("top_info_text").style.display = "block";

    var test_top = document.getElementById("bottom_info_text").innerHTML;

        if (test_top === "Response Saved 👏") {
            document.getElementById("top_info_text").innerHTML ="Thanks for your feedback 💕";
        } else {
            document.getElementById("top_info_text").innerHTML ="Response Saved 👏";

        }
    }
};

var button_bottom = document.querySelectorAll(".bottom_emoji");
for (var i = 0; i < button_bottom.length; i++)  {

    button_bottom[i].onclick = function() {
    document.getElementById("body_bottom").style.display = "none";
    document.getElementById("bottom_info_text").style.display = "block";

        var test = document.getElementById("top_info_text").innerHTML;
        
        if (test === "Response Saved 👏") {

            document.getElementById("bottom_info_text").innerHTML ="Thanks for your feedback 💕";
        } else {
        
            document.getElementById("bottom_info_text").innerHTML ="Response Saved 👏";
        }
        
    }
};

