const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

// 音乐名字
const songs = ['hey', 'summer', 'ukulele'];

// 歌曲索引
let songIndex = 2;

// 最开始加载的歌曲
loadSong(songs[songIndex]); // songs 是一个数组，songs[2]就表示 ['hey', 'summer', 'ukulele']; 的第二个

// 切换歌曲
function loadSong(song) {
  title.innerText = song; // 把歌曲名字放到 title 元素里
  audio.src = `music/${song}.mp3`; // 替换 audio 元素的 src 属性
  cover.src = `images/${song}.jpg`; // ${} 是变量
}

// 播放
function playSong() {
  musicContainer.classList.add('play'); // css 写了 .music-container 这里的 play 就是 .music-container.play
  // 进一步解释：.music-container.play 表示
  // 选择同时具有 music-container 和 play 类的元素，以应用相应的 CSS 样式。

  playBtn.querySelector('i.fas').classList.remove('fa-play'); // querySelector 选择器，选择 playBtn 元素里的 带 fas 的所有 i 元素
  // 移除 fa-play 类 fa-play 是播放按钮的图标 移除「播放」换成「暂停」
  playBtn.querySelector('i.fas').classList.add('fa-pause'); // 添加 fa-pause 类

  // 播放 audio 元素
  audio.play();
}

// 暂停
function pauseSong() {
  // 移除 play 类
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.add('fa-play'); // 添加播放按钮
  playBtn.querySelector('i.fas').classList.remove('fa-pause'); // 移除暂停按钮
  
  // 暂停 audio 元素
  audio.pause();
}

// 上一首歌
function prevSong() {
  // songIndex = songIndex - 1;
  songIndex--;

  if (songIndex < 0) { // 减到 0 播放最后一首歌
    songIndex = songs.length - 1;
  }

  loadSong(songs[songIndex]); // 加载歌曲

  playSong(); // 播放
}

// 下一首歌
function nextSong() {
  songIndex++;

  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }

  loadSong(songs[songIndex]);

  playSong();
}

// 更新进度条
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
}

// 设置进度条
function setProgress(e) {
  const width = this.clientWidth; // 
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

// 时间
function DurTime (e) {
	const {duration,currentTime} = e.srcElement;
	var sec;
	var sec_d;

	// define minutes currentTime
	let min = (currentTime==null)? 0:
	 Math.floor(currentTime/60);
	 min = min <10 ? '0'+min:min;

	// define seconds currentTime
	function get_sec (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec = Math.floor(x) - (60*i);
					sec = sec <10 ? '0'+sec:sec;
				}
			}
		}else{
		 	sec = Math.floor(x);
		 	sec = sec <10 ? '0'+sec:sec;
		 }
	} 

	get_sec (currentTime,sec);

	// change currentTime DOM
	currTime.innerHTML = min +':'+ sec;

	// define minutes duration
	let min_d = (isNaN(duration) === true)? '0':
		Math.floor(duration/60);
	 min_d = min_d <10 ? '0'+min_d:min_d;


	 function get_sec_d (x) {
		if(Math.floor(x) >= 60){
			
			for (var i = 1; i<=60; i++){
				if(Math.floor(x)>=(60*i) && Math.floor(x)<(60*(i+1))) {
					sec_d = Math.floor(x) - (60*i);
					sec_d = sec_d <10 ? '0'+sec_d:sec_d;
				}
			}
		}else{
		 	sec_d = (isNaN(duration) === true)? '0':
		 	Math.floor(x);
		 	sec_d = sec_d <10 ? '0'+sec_d:sec_d;
		 }
	} 

	// define seconds duration
	
	get_sec_d (duration);

	// change duration DOM
	durTime.innerHTML = min_d +':'+ sec_d;
		
};

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// 上下按钮
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// 进度
audio.addEventListener('timeupdate', updateProgress);

// 点击进度条
progressContainer.addEventListener('click', setProgress);

// 播放完自动播放下一首
audio.addEventListener('ended', nextSong);

// 
audio.addEventListener('timeupdate',DurTime);
