// Configuración del reproductor de video
var playerOptions = {
    autoplay: true,
    sources: [
      {
        default: false,
        type: "application/x-mpegURL",
        src: "https://5cd577a3dd8ec.streamlock.net/canal4/smil:manifest.smil/playlist.m3u8",
      },
    ],
  };

  // Inicializar el reproductor de video
  var player = videojs("videoPlayer", playerOptions);