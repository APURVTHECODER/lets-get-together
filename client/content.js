let videoplayer;
let adTimer;
let myid;
let roomid;
let iamhost = false;

let allusersinroom = {};

const socket = io('http://localhost:4000/');

socket.on('whoami', function ({ id }) {
	// console.log('myid', id);
	myid = id;
});

function checkIsAdPlayng() {
	adTimer = setInterval(() => {
		let isAd = document.querySelector('.ad-cta-wrapper');
		if (isAd === null) {
			getVideoPlayer();
		}
	}, 1000);
}

function getVideoPlayer() {
	clearInterval(adTimer);

	videoplayer = document.querySelector('video');
	if(videoplayer){
		videoplayer.removeAttribute('autoplay');
	}

	//keep listening to the hosts videoplayer events, only host can control the play pause and seek
	if (iamhost) {
		setInterval(() => {
			syncVideoStates();
		}, 1000);
	}
}

function syncVideoStates() {
	let videoState = {
		hosttime: videoplayer?.currentTime,
		isHostPaused: videoplayer?.paused,
	};
	socket.emit('videoStates', { videoState, roomid });
}

// listen to hosts video player states

socket.on('videoStates', ({ isHostPaused, hosttime }) => {
	// sync video player pause and play of users with the host
	if (!iamhost) {
		if (isHostPaused) {
			videoplayer?.pause();
		} else {
			videoplayer?.play();
		}

		let diffOfSeek = videoplayer?.currentTime - hosttime;

		// sync time if any user is behind by more than 8 s (in case of poor connection)
		// or if any user is forward 8s than everyone
		if (diffOfSeek < -8 || diffOfSeek > 8) {
			videoplayer.currentTime = hosttime;
		}
	}
});

/* HTML OUTPUT ON BROWSER */

const hostbutton = document.createElement('div');
hostbutton.innerHTML = 'Start New Room';

const status = document.createElement('div');
status.id = 'status-container';

const main_container = document.createElement('DIV');
const start_container = document.createElement('DIV');
const roomlabel = document.createElement('DIV');
const input = document.createElement('INPUT');
const letspartytitle = document.createElement('DIV');
const nameinput = document.createElement('INPUT');
const joinbutton = document.createElement('DIV');
const closeBtn = document.createElement('div');

const send_container = document.createElement('form');
const messageInp = document.createElement('input')
const submitbtn = document.createElement('button')
const messageContainer = document.createElement('div');
// const showbtn = document.createElement('button')
// showbtn.innerHTML = 'Buddys';

messageContainer.id = 'message-container';
const emojiBtn1 = document.createElement('button');
emojiBtn1.id = 'emoji-btn1';
emojiBtn1.innerHTML = '😀';

// Get the text input element

// Add an event listener to the emoji button

//=========================================
messageContainer.id = 'message-container';
const emojiBtn2 = document.createElement('button');
emojiBtn2.id = 'emoji-btn2';
emojiBtn2.innerHTML = '😁';
//==========================================
messageContainer.id = 'message-container';
const emojiBtn3 = document.createElement('button');
emojiBtn3.id = 'emoji-btn3';
emojiBtn3.innerHTML = '😂';
//==========================================
messageContainer.id = 'message-container';
const emojiBtn4 = document.createElement('button');
emojiBtn4.id = 'emoji-btn4';
emojiBtn4.innerHTML = '🤣';
//=============================================
messageContainer.id = 'message-container';
const emojiBtn5 = document.createElement('button');
emojiBtn5.id = 'emoji-btn5';
emojiBtn5.innerHTML = '😃';
//==========================================
messageContainer.id = 'message-container';
const emojiBtn6 = document.createElement('button');
emojiBtn6.id = 'emoji-btn6';
emojiBtn6.innerHTML = '😄';
//=========================================
messageContainer.id = 'message-container';
const emojiBtn7 = document.createElement('button');
emojiBtn7.id = 'emoji-btn7';
emojiBtn7.innerHTML = '😅';
//==========================================
messageContainer.id = 'message-container';
const emojiBtn8 = document.createElement('button');
emojiBtn8.id = 'emoji-btn8';
emojiBtn8.innerHTML = '😍';

send_container.appendChild(emojiBtn1);
send_container.appendChild(emojiBtn2);
send_container.appendChild(emojiBtn3);
send_container.appendChild(emojiBtn4);
send_container.appendChild(emojiBtn5);
send_container.appendChild(emojiBtn6);
send_container.appendChild(emojiBtn7);
send_container.appendChild(emojiBtn8);
send_container.appendChild(messageInp);
send_container.appendChild(submitbtn);

// showbtn.id = 'show-btn';
// showbtn.style.display = 'none';

hostbutton.id = 'host-btn';
main_container.classList.add('main-container');
main_container.id = 'main-container';
start_container.classList.add('start-container');
start_container.id = 'start-container';

send_container.id = 'send-container';
send_container.action = '#';
send_container.style.display = 'none';

messageInp.type = 'text';
messageInp.id = 'messageInp';
messageInp.placeholder = 'Type your Message Here...'
messageInp.style.display = 'none';

submitbtn.id = 'submitbtn';
submitbtn.type='submit';
submitbtn.innerHTML = 'Send';
submitbtn.style.display = 'none'
messageContainer.style.display = 'none';

letspartytitle.id = 'lets-party-title';
letspartytitle.innerHTML = "Let's Get-Together!📺 ";

roomlabel.id = 'room-label';
input.id = 'room-id-input';
nameinput.id = 'name-id';
nameinput.placeholder = 'Enter display name';
input.placeholder = 'Enter room Code';
joinbutton.id = 'join-btn';
closeBtn.id = 'close-btn';

roomlabel.innerHTML = `OR`;
joinbutton.innerHTML = `Join`;
closeBtn.innerHTML = '❌';

const start_top = document.createElement('div')
start_top.id = 'top'
const minimize = document.createElement('button')
minimize.id = 'minimize';
minimize.innerText = '—';

const title = document.createElement('a')
title.id = 'title-name';
title.innerText = 'Let\'s Get-Together';
// title.href = '#'
title.target = 'blank';

start_top.appendChild(minimize);
start_top.appendChild(title);
main_container.appendChild(start_top);

start_container.appendChild(letspartytitle);
start_container.appendChild(hostbutton);
start_container.appendChild(roomlabel);
start_container.appendChild(input);
start_container.appendChild(joinbutton);
start_container.appendChild(status);

start_container.appendChild(nameinput);

start_container.appendChild(messageContainer);
start_container.appendChild(send_container);
// start_container.appendChild(showbtn);
main_container.appendChild(start_container);
main_container.appendChild(closeBtn);

document.querySelector('body').appendChild(main_container);


minimize.addEventListener('click', () => {
	const box = document.getElementById('start-container')
	const main_box = document.getElementById('main-container')
	const title_name = document.getElementById('title-name')

    if (box.style.display == 'none') {
      box.style.display = 'block'
	  main_box.style.height = '100vh'
	  title_name.style.display = 'none'
    } else {
      box.style.display = 'none'
	  main_box.style.height = '5vh'
	  title_name.style.display = 'block'
    }
})

hostbutton.addEventListener('click', () => {
	if (nameinput.value !== '') {
		localStorage.setItem('lets_party_uname', nameinput.value);
		socket.emit('joinmetothisroom', { roomid: myid, name: nameinput.value });
		roomid = myid;
		iamhost = true;
	} else {
		alert('Enter your display name');
	}
});
//=======================
//create send button
// const sendbtn = document.createElement('button');
// sendbtn.id = 'send-btn';
// sendbtn.innerHTML = 'Send';

// // add send button to send_container
// send_container.appendChild(sendbtn);
//=========================



// const emojiBtn = document.createElement('button');
// emojiBtn.id = 'emoji-btn';
// emojiBtn.innerHTML = '😀';

// messageInp.parentNode.insertBefore(emojiBtn, messageInp.nextSibling);

// emojiBtn.addEventListener('click', () => {
// 	messageInp.value += '😀'; // You can replace this with any emoji of your choice
// 	messageInp.focus();
// });

// // Create the container element for the message input and send button
// const messageInputContainer = document.createElement('div');
// messageInputContainer.id = 'message-input-container';

// // Append the message input and send button to the new container element
// messageInputContainer.appendChild(messageInp);
// messageInputContainer.appendChild(submitbtn);

// // Append the container element to the message container
// messageContainer.appendChild(messageInputContainer);

joinbutton.addEventListener('click', () => {
	if (input.value !== '' && nameinput.value !== '') {
		localStorage.setItem('lets_party_uname', nameinput.value);
		socket.emit('joinmetothisroom', {
			roomid: input.value,
			name: nameinput.value,
		});
		roomid = input.value;
	} else {
		alert('Enter your Code and Display Name');
	}
});
// emojiBtn1.addEventListener('click', () => {
// 	const messageDiv = document.createElement('div');
// 	messageDiv.innerHTML = '😀';
// 	messageContainer.appendChild(messageDiv);
//   });

// showbtn.addEventListener('click', () => {
// 	console.log(`${allusersinroom}`);
// 	for (const [id, name] of Object.entries(allusersinroom)) {
// 		if (id==roomid){
// 			console.log(`Host = > ${id}: ${name}`);
// 		}
// 		else{
// 			console.log(`Buddy => ${id}: ${name}`);
// 		}
// 	}
// });

socket.on('who_joined', (allusers) => {
	if (!iamhost) {
		allusersinroom = allusers;
	}
});


closeBtn.addEventListener('click', () => {
	main_container.style.right = '-100%';
});


socket.on('joinmetothisroomsuccess', (msg) => {
	let thecode = `<code class="roomcode">${msg}</code>`;
	roomlabel.style.display = 'none';
	input.style.display = 'none';
	joinbutton.style.display = 'none';
	hostbutton.style.display = 'none';
	nameinput.style.display = 'none';
	send_container.style.display = 'block';
	messageInp.style.display = 'block';
	submitbtn.style.display = 'block';
	messageContainer.style.display = 'block';
	// showbtn.style.display = 'block';
	start_container.style.marginTop = '0px';
	status.innerHTML = `Room Code: <br> ${thecode} <br> Tell everyone to join here! <br> <br> <br>`;
	checkIsAdPlayng();
});

socket.on('someonejoined', data => {
	append(`${data.name} joined the Room`, 'center');
	if (iamhost) {
		allusersinroom[data.id] = data.name;
		socket.emit('tell_everyone_who_joined', {
			allusers: allusersinroom,
			roomid,
		});
	}
});

// Function which will append event info to the contaner
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
	messageElement.style.display = 'block';
}

// If the form gets submitted, send server the message
send_container.addEventListener('submit', (e) => {
	e.preventDefault();
	const message = messageInp.value;
	socket.emit('send', {message: message, roomid: roomid, myid:myid});
	messageInp.value = '';
  });
  
  emojiBtn1.addEventListener('click', function() {
	// Insert the emoji into the text input
	const textInput = messageInp;
	textInput.value += '😀';
  });
  
  emojiBtn2.addEventListener('click', function() {
	// Insert the emoji into the text input
	const textInput = messageInp;
	textInput.value += '😁';
  });
  
  emojiBtn3.addEventListener('click', function() {
	// Insert the emoji into the text input
	const textInput = messageInp;
	textInput.value += '😂';
  });
  
  emojiBtn4.addEventListener('click', function() {
	// Insert the emoji into the text input
	const textInput = messageInp;
	textInput.value += '🤣';
  });
  
  emojiBtn5.addEventListener('click', function() {
	// Insert the emoji into the text input
	const textInput = messageInp;
	textInput.value += '😃';
  });
  
  emojiBtn6.addEventListener('click', function() {
	// Insert the emoji into the text input
	const textInput = messageInp;
	textInput.value += '😄';
  });
  
  emojiBtn7.addEventListener('click', function() {
	// Insert the emoji into the text input
	const textInput = messageInp;
	textInput.value += '😅';
  });
  
  emojiBtn8.addEventListener('click', function() {
	// Insert the emoji into the text input
	const textInput = messageInp;
	textInput.value += '😍';
  });
  
// If server sends a message, receive it
socket.on('receive', data =>{
	if (data.myid==myid){
		append(`You: ${data.message}`, 'right');
	}
	else{
		append(`${data.name}: ${data.message}`, 'left');
	}
})

// If a user leaves the chat, append the info to the container
socket.on('printStatus', data =>{
	if (data.id==roomid){
		append(`${data.name}(Host) left the Room`, 'center');
	}
	else{
		append(`${data.name} left the Room`, 'center');
	}
	delete allusersinroom[data.id];
})

socket.on('msg', (msg) => {
	console.log(msg);
});

document.querySelector('body').appendChild(main_container);

