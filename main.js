// list cac task need resolve
/**  1. render songs
2. scroll top
3. play/pause/seek
4. cd rotate
5. next/prev
6.random
7.next/repeat when song end
8. active song
9. scroll active song into view
10. play song when click
**/
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const player = $('.player')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
// console.log(progress)

const app  = {
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
        {
            name:'Có chàng trai viết lên cây',
            singer:'Phan Mạnh Quỳnh',
            path:'./assets/musics/song1.mp3',
            image:'./assets/img/song1.png'
        },
        {
            name:'Từ đó',
            singer:'Phan Mạnh Quỳnh',
            path:'./assets/musics/song2.mp3',
            image:'./assets/img/song2.png'
        },
        {
            name:'Cảm ơn tháng năm',
            singer:'Dungb',
            path:'./assets/musics/song3.mp3',
            image:'./assets/img/song3.png'
        },
        {
            name:'Sau này hãy gặp lại nhau khi hoa nở',
            singer:'Nguyên Hà',
            path:'./assets/musics/song4.mp3',
            image:'./assets/img/song4.png'
        },
        {
            name:'Đồi hoa mặt trời',
            singer:'Hoàng Yến chibi',
            path:'./assets/musics/song5.mp3',
            image:'./assets/img/song5.png'
        },
        {
            name:'Mashup Ngôi nhà hoa hồng',
            singer:'Vicky Nhung- Tố Ny',
            path:'./assets/musics/song6.mp3',
            image:'./assets/img/song6.png'
        },
        {
            name:'Nàng thơ',
            singer:'Hoàng Dũng',
            path:'./assets/musics/song7.mp3',
            image:'./assets/img/song7.png'
        },
        {
            name:'Sài gòn đau lòng quá',
            singer:'Hoàng quyên - Hứa kim tuyền',
            path:'./assets/musics/song8.mp3',
            image:'./assets/img/song8.png'
        },
        {
            name:'Tình sâu đậm, mưa mịt mù',
            singer:'Yukisan',
            path:'./assets/musics/song9.mp3',
            image:'./assets/img/song9.png'
        },
        {
            name:'Nàng thơ xứ huế',
            singer:'Thùy chi',
            path:'./assets/musics/song10.mp3',
            image:'./assets/img/song10.png'
        }
    ],
    setConfig:function(key,value){
        this.config(key) = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render:function () {
       // console.log(123);
       const htmls = this.songs.map((song,index) => {
        return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}');">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                 `
       })
       playlist.innerHTML = htmls.join('');
    },
    defineProperties:function() {
        Object.defineProperty(this, 'currentSong',  {
            get:function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    // getCurrentSong: function(){
    //     return this.songs[this.currentIndex]
    // },
    handleEvents: function(){
        const _this = this
        // const cd = $('.cd')
        const cdWidth = cd.offsetWidth

        // xu ly cd quay va dung
        const cdThumbAnimate = cdThumb.animate([
            {transform:'rotate(360deg)'}
        ], {
            duration:1000, // 10 seconds
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // xu ly phong to, thu nho cd
        document.onscroll = function () {
            //console.log(window.scrollY)
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            //console.log(newCdWidth)
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        // xu ly khi click play
            // const playBtn = $('.btn-toggle-play')
            playBtn.onclick = function() {
                if (_this.playing) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
        // xu ly khi song dc play thu su
        audio.onplay = function(){
            _this.playing = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        // xu ly khi song bi pause
        audio.onpause = function () {
            _this.playing = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        // khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
         
        }
        // xu ly khi tua bai hat
        progress.onchange = function (e) {
          //  console.log(e.target.value)
          const seekTime = audio.duration*e.target.value / 100
          audio.currentTime = seekTime;
        }

        // xu ly khi next bai hat
        nextBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // xu ly khi prev bai hat
        prevBtn.onclick = function () {
            if(_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
        }
        // xu ly khi click btn random
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }
        // xu ly next song khi audio ended
        audio.onended = function () {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
           
        }
        // xu ly phat lai mot bai hat
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // lang nghe su kien click vao playlist
        playlist.onclick = function (e) {
            //console.log(e.target)
            const songNode = e.target.closest('.song:not(.active)');
            if(
               songNode || e.target.closest('.option') ) {
                     // xu ly khi click vao song
                     if (songNode) {
                      //  console.log(songNode.getAttribute('data-index'))
                     // console.log(songNode.dataset.index)
                     _this.currentIndex = Number(songNode.dataset.index);
                     _this.loadCurrentSong();
                     _this.render();
                     audio.play();
                     }
                     // xu ly khi click vao song option
                     if (e.target.closest('.option')) {

                     }
            }
        }

    },
    scrollToActiveSong:function() {
        setTimeout (() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:"nearest"
            });
        },300)
    },

    loadCurrentSong:function(){
        // const heading = $('header h2');
        // const cdThumb = $('.cd-thumb');
        // const audio = $('#audio');

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;

        console.log(heading, cdThumb,audio)
    },
    loadConfig:function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong:function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong:function() {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },
    playRandomSong:function() {
        let newIndex
        do {
             newIndex = Math.floor(Math.random()* this.songs.length)
        } while (newIndex === this.currentIndex)
        //console.log(newIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start:function () {
        // gan cau hinh tu config vao ung dung
        this.loadConfig();
        // định nghĩa các thuộc tính cho object
        this.defineProperties();
        //console.log(this.getCurrentSong());

        // lắng nghe , xử lý các sự kiện DOM event
        this.handleEvents();

        // tai thong tin bai hat vao UI khi chay ung dung
        this.loadCurrentSong();
        // render playlist
        this.render();
    }

}
app.start();