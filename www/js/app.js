var player,
    time_update_interval = 0;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-placeholder', {
        width: 600,
        height: 200,
        videoId: 'ady7qdruIC8',
        playerVars: {
            color: 'white',
            playlist: 'taJ60kskkns,FG0fTKAqZ5g'
        },
        events: {
            onReady: initialize
        }
    });
}

function initialize(){

    // Update the controls on load
    updateTimerDisplay();
    updateProgressBar();

    // Clear any old interval.
    clearInterval(time_update_interval);

    // Start interval to update elapsed time display and
    // the elapsed part of the progress bar every second.
    time_update_interval = setInterval(function () {
        updateTimerDisplay();
        updateProgressBar();
    }, 1000);


    $('#volume-input').val(Math.round(player.getVolume()));
}


// This function is called by initialize()
function updateTimerDisplay(){
    // Update current time text display.
    $('#current-time').text(formatTime( player.getCurrentTime() ));
    $('#duration').text(formatTime( player.getDuration() ));
}


// This function is called by initialize()
function updateProgressBar(){
    // Update the value of our progress bar accordingly.
    $('#progress-bar').val((player.getCurrentTime() / player.getDuration()) * 100);
}


// Progress bar

$('#progress-bar').on('mouseup touchend', function (e) {

    // Calculate the new time for the video.
    // new time in seconds = total duration in seconds * ( value of range input / 100 )
    var newTime = player.getDuration() * (e.target.value / 100);

    // Skip video to new time.
    player.seekTo(newTime);

});


// Playback

$('#play').on('click', function () {
    player.playVideo();
});


$('#pause').on('click', function () {
    player.pauseVideo();
});


// Sound volume


$('#mute-toggle').on('click', function() {
    var mute_toggle = $(this);

    if(player.isMuted()){
        player.unMute();
        mute_toggle.text('volume_up');
    }
    else{
        player.mute();
        mute_toggle.text('volume_off');
    }
});

$('#volume-input').on('change', function () {
    player.setVolume($(this).val());
});


// Other options


$('#speed').on('change', function () {
    player.setPlaybackRate($(this).val());
});

$('#quality').on('change', function () {
    player.setPlaybackQuality($(this).val());
});


// Playlist

$('#next').on('click', function () {
    player.nextVideo()
});

$('#prev').on('click', function () {
    player.previousVideo()
});


// Load video

$('.thumbnail').on('click', function () {

    var url = $(this).attr('data-video-id');

    player.cueVideoById(url);

});


// Helper Functions

function formatTime(time){
    time = Math.round(time);

    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
}


$('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
});



var channelName = 'lucianocsilveira';

$(document).ready(function(){
    $.get(
        "https://www.googleapis.com/youtube/v3/channels",{
            part:'contentDetails',
            forUsername: channelName,
            key:'AIzaSyBUd8enC_o-pv3lWZVpQOENu9i-I9-v4Y0'},
            function(data){
                $.each(data.items,function(i,item){
                    console.log(item);
                    pid = item.contentDetails.relatedPlaylists.uploads;
                    getVideos(pid);

                })
            }
    );

    function getVideos(pid){

        $.get(
            "https://www.googleapis.com/youtube/v3/playlistItems",{
                part:'snippet',
                maxResults: 50,
                playlistId: pid,
                key:'AIzaSyBUd8enC_o-pv3lWZVpQOENu9i-I9-v4Y0'},
                function(data){
                    var output;
                    $.each(data.items,function(i,item){
                        console.log(item);
                        video = item.snippet;
                        $('#videos').append(getHtmlCard(video));

                    })
                }
        );
    
    }

});



function getHtmlCard(video){
    var strData = video.publishedAt;
    var data = strData.substring(8, 10)+'/'+strData.substring(5, 7)+'/'+strData.substring(0, 4);
    var html="";
    html=html+'      <div class="swiper-slide">';
    html=html+'         <div class="row mx-0">';
    html=html+'             <div class="col-100">';
    html=html+'                 <figure class="w-100" style="height: auto;"><img src="'+video.thumbnails.high.url+'" alt=""></figure>';
    html=html+'             </div>';
    html=html+'             <div class="col-100">';
    html=html+'                 <p>';
    html=html+'                     <br>'+video.title+'';
    html=html+'                     <br><small>'+video.description+'</small>';
    html=html+'                     <br>';
    html=html+'                     <small>'+data+'</small>';
    html=html+'                 </p>';
    html=html+'             </div>';
    html=html+'         </div>';
    html=html+'     </div>';
    
      return html;
    }
    
