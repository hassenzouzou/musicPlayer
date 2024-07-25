const prevTrackButton = document.querySelector(".prev-track");
const playPauseButton = document.querySelector(".playpause-track");
const nextTrackButton = document.querySelector(".next-track");
const seekSlider = document.querySelector(".seek_slider");
const volumeSlider = document.querySelector(".volume_slider");
const currTime = document.querySelector(".current-time");
const totalDuration = document.querySelector(".total-duration");
const trackArtElement = document.querySelector(".track-art");
const trackNameElement = document.getElementById("trackName");
const trackArtistElement = document.getElementById("trackArtist");

let isPlaying = false;
let trackIndex = 0;
const audio = new Audio();
let updateTimer;
let tracks = [];

async function fetchTracks() {
  const response = await fetch("http://localhost:3000/tracks");
  const data = await response.json();
  tracks = data;
  loadTrack();
}

function loadTrack() {
  if (updateTimer) clearInterval(updateTimer);
  audio.src = tracks[trackIndex].path;
  trackArtElement.src = tracks[trackIndex].pic;
  trackNameElement.textContent = tracks[trackIndex].name;
  trackArtistElement.textContent = tracks[trackIndex].artist;
  audio.play();
  playPauseButton.textContent = "⏸️";
  isPlaying = true;
  updateTimer = setInterval(updateTime, 1000);
}

function playpauseTrack() {
  if (isPlaying) {
    audio.pause();
    playPauseButton.textContent = "▶️";
  } else {
    audio.play();
    playPauseButton.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
}

function prevTrack() {
  trackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
  loadTrack();
}

function nextTrack() {
  trackIndex = (trackIndex + 1) % tracks.length;
  loadTrack();
}

function seekTo() {
  const value = seekSlider.value;
  audio.currentTime = (audio.duration * value) / 100;
}

function setVolume() {
  audio.volume = volumeSlider.value / 100;
}

function updateTime() {
  if (audio.duration) {
    const currentTime = Math.floor(audio.currentTime);
    const duration = Math.floor(audio.duration);
    const minutesCurrent = Math.floor(currentTime / 60);
    const secondsCurrent = currentTime % 60;
    const minutesTotal = Math.floor(duration / 60);
    const secondsTotal = duration % 60;
    currTime.textContent = `${minutesCurrent}:${
      secondsCurrent < 10 ? "0" : ""
    }${secondsCurrent}`;
    totalDuration.textContent = `${minutesTotal}:${
      secondsTotal < 10 ? "0" : ""
    }${secondsTotal}`;
    seekSlider.value = (currentTime / duration) * 100;
  }
}

playPauseButton.addEventListener("click", playpauseTrack);
prevTrackButton.addEventListener("click", prevTrack);
nextTrackButton.addEventListener("click", nextTrack);
seekSlider.addEventListener("input", seekTo);
volumeSlider.addEventListener("input", setVolume);

fetchTracks();
