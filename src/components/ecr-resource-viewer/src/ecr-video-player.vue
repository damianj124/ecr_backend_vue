<template>
    <section id="vcontainer">
    </section>
</template>

<script>
    export default {
        props: {
            path: String
        },
        watch: {
            path: function(val, oldval) {
                this.remount(ECO_MEDIA_PATH + val);
            }
        },
        methods: {
            remount(path) {
                if ($('#vplayer').length > 0) {
                    videojs('vplayer').dispose();
                    $('#vplayer').remove();
                }

                var type = path.substring(path.lastIndexOf(".") + 1);
                if (type == "m3u8") {
                    type = "application/x-mpegURL";
                } else {
                    type = "video/mp4";
                }

                var videoTag = '<video id="vplayer" class="video-js vjs-default-skin" controls preload="auto" data-setup="{}">\
                        <source src="' + path + '" type="' + type + '">\
                    </video>';

                // Need To Clear This Block
                $("#vcontainer").append(videoTag);
                videojs('vplayer');
                videojs('vplayer').dispose();
                $('#vplayer').remove();
                //

                $("#vcontainer").append(videoTag);
                videojs('vplayer');

                let _this = this;
                this.$nextTick(function() {
                    var marginTop = document.getElementById("vcontainer").clientHeight / 2;
                    $("#vcontainer .vjs-big-play-button").css("margin-top", "calc(" + marginTop + "px - 1em)");
                });
            },
        },
        mounted() {
            this.remount(ECO_MEDIA_PATH + this.path);
        }
    }
</script>

<style scoped lang="scss">
    section {
        width: 100%;
        height: 100%;
    }
</style>

<style>
    #vplayer {
        width: 100%;
        height: 100%;
        background-color: black;
    }
</style>