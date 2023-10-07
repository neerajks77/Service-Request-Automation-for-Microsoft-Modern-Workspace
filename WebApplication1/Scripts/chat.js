var initcht = 1, initusr = 1;

$(document).on("ready", function () {
    $("#parentchatdiv").append("<div id='chtDiv" + initcht + "' style='display:-webkit-inline-box'><img src='../images/chatGPT_icon.png' style='width: 40px; height: 40px; padding: 5px'/><div class='oai_chat'>Hi, Welcome to CloudOps chat! \n How may I help you today? Please use the text box below to enter your query...</div></div>");
    $("#chtDiv" + initcht).hide();
    $("#chtDiv" + initcht).fadeIn();
    initcht++;

    $("#citations").css("diaplay", "none");
});

$(function () {
    $("#SendMessage").click(function () {
        if (!$("#qnatextbox").val() || $("#qnatextbox").val().length === 0) {
            alert("Ask a question before submission");
        }
        else {
            $("#summary").attr("src", '');
            var citation = '';
            var user_input = $("#qnatextbox").val();
            var input = "<div id='usrDiv" + initusr + "' style='margin-right: 0; margin-left: auto; margin-top: 10'><img src='../images/user.jpeg' style='width: 40px; height: 40px; padding: 5px; float: right' /><div class='user_chat'>" + user_input + "</div></div>";
            $("#parentchatdiv").append(input).html();
            $("#usrDiv" + initusr).css("display", "none");
            $("#usrDiv" + initusr).fadeIn();
            $("#qnatextbox").val('');
            initusr++;
            var finalurl = "https://gpttrainingitops.azurewebsites.net/getresponse?query=" + user_input
            $.ajax({
                url: finalurl,
                type: "POST",
                cache: false,
                success: function (response) {
                    response = response["content"].replace(/\n/g, " <br/>");
                    if (response.indexOf('Source') != -1) {
                        var citation = response.substring(response.indexOf('Source'));
                        var $words = citation.split(' ');
                        for (var i = 0; i < $words.length; i++) {
                            if ($words[i].indexOf('Source') != -1) {
                                $words[i] = "<b>" + $words[i] + "</b>";
                            }
                            if ($words[i].indexOf('https://') == 0 || $words[i].indexOf('http://') == 0) {
                                $words[i] = $words[i].replace('(', '');
                                $words[i] = $words[i].replace(/\)/g, '');
                                $words[i] = ' <a id="urls" target="_blank" href="' + $words[i] + '">' + $words[i] + '</a>';
                            }
                            if ($words[i].indexOf('(https://') != -1 || $words[i].indexOf('(http://') != -1) {
                                $word = $words[i].split('(');
                                $word[0] = $word[0] + "<br/>"
                                $word[1] = $word[1].replace(/\)/g, '');
                                $word[1] = ' <a id="urls" target="_blank" href="' + $word[1] + '">' + $word[1] + '</a>';
                                $word = $word.join(' ');
                                $words[i] = $word;
                            }
                        }
                        citation = $words.join(' ');
                        citation = "<span id='cit" + initcht + "' style='display:none;'>" + citation + "</span>"
                        $("#citations").html(citation);
                        response = response.substring(0, response.indexOf('Source') - 1);
                        var btn = "cit" + initcht;
                        response = response + '<br/><br/><button id="btn" href="#" onClick="displayspan(' + "'" + btn + "'" + ')">citation(s)</button>';
                    }
                    
                    chatresponse = "<div id='chtDiv" + initcht + "' style='display:-webkit-inline-box'><img src='../images/chatGPT_icon.png' style='width: 40px; height: 40px; padding: 5px'/><div id = 'oai_chat" + initcht + "' class='oai_chat'></div></div>";
                    $("#parentchatdiv").append(chatresponse).html();
                    $("#oai_chat" + initcht).html(response);
                    $("#chtDiv" + initcht).hide();
                    $("#chtDiv" + initcht).fadeIn();
                    
                    initcht++;
                }
            });
        }
    });
});
function displayspan(id) {
    $("#" + jQuery.trim(id)).toggle();
}



