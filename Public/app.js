
let playerNum = 0;
let ready = false;
let enemyReady = false;
var text;
var MyText = "";

const socket = io();

function spectator() {
    document.getElementById("MyInput").disabled = true;
}

function isLetter(str) {
    return str.length === 1 && (str.match(/[a-z]/i) || str == ' ');
}
function isPonctuation(str){
    return str.length == 1 && !!str.match(/^[.,:!?{}#"&~#(-|)`_@=+]/);
}

fetch('/getText', { method: "GET" })
    .then((json) => { return json.json(); })
    // .then((data)=>{document.getElementById("Text").innerHTML = data.text;})
    .then((data) => {
        text = data.text;
        document.getElementById("Text").innerHTML = text;
    })
    .catch(err => console.error(err));
// Get your player number
socket.on('player-number', num => {
    if (num === -1) {
        spectator();
    } else {
        playerNum = parseInt(num)
        if (playerNum === 1) currentPlayer = "enemy"

        console.log(playerNum);

        // Get other player status
        socket.emit('check-players');
    }
})

socket.on('printf-writing', (data) => {
    if (playerNum == -1) {
        if (data.id == 0) {
            document.getElementById("MyText").innerHTML = data.writing;
            MyText = data.writing;
        } else if (data.id == 1) {
            document.getElementById("EnnemyText").innerHTML = data.writing;
        }
    } else {
        if (data.id == playerNum) {
            document.getElementById("MyText").innerHTML = data.writing.replaceAll(" ", "&nbsp;");
            document.getElementById("MyText").innerHTML += "&lrm;";
            document.getElementById("Text").innerHTML = text.substring(data.taille).replaceAll(' ', "&nbsp;");
        } else {
            document.getElementById("EnnemyText").innerHTML = data.writing;
        }
    }
})
document.addEventListener("keydown", function(event){
    if (event.ctrlKey) {
        event.preventDefault();
     }
    if(!isLetter(event.key))
        console.log(event.key);
    let key = "k";
    let key_use = event.key == "Insert" || event.key == "Home" || event.key == "PageUp" || event.key == "Delete" || event.key == "End" || event.key == "PageDown" || event.key == "ArrowLeft" || event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowRight" || event.key == "Pause" || event.key == "ScrollLock" || event.key == "NumLock" ;
    switch(event.key){
        case '\\' :
            key += "barre_oblique_inverse";
            break;
        case "Dead":
            break;
        case "``":
            key += 'accent_grave';
            break;
        case "è":
            key += 'e_accent_grave';
            break;
        case "-":
            key += 'tiret';
            break;
        case "|":
            key += 'barre_vertical';
            break;
        case " ":
            key += 'space';
            break;
        case "<":
            key += 'chevron';
            break;
        case ">":
            key += 'chevron';
            break;
        case '"':
            key += 'guillemet';
            break;
        case "'":
            key += 'apostrophe';
            break;
        case "{":
            key += 'obracket';
            break;
        case "(":
            key += 'oparenthese';
            break;
        case "[":
            key += 'oCrochet';
            break;
        default :
            key += event.key.toLowerCase();
            break;
    }
    if(key != 'k' && !key_use){
        document.getElementsByClassName(key)[0].classList.add("pressed");
        if(isLetter(event.key) || isPonctuation(event.key)){
            socket.emit('writing', { "id": playerNum, "writing": MyText+=event.key });
        }else if(event.key == "Backspace"){
            MyText = MyText.substring(0, MyText.length - 1);
            socket.emit('writing', { "id": playerNum, "writing": MyText});
        }
        setTimeout(() => {document.getElementsByClassName(key)[0].classList.remove("pressed")}, 100);
    }
//         pressedKey.addClass('pressed');
});

// $(window).on({
//     'keydown': function (e) {
//         var pressedKey = $('.k' + e.keyCode);
//         pressedKey.addClass('pressed');
//     },
//     'keyup': function (e) {
//         var pressedKey = $('.k' + e.keyCode);
//         pressedKey.removeClass('pressed');
//     }
// });
// Another player has connected or disconnected
// socket.on('player-connection', num => {
//     console.log(`Player number ${num} has connected or disconnected`);
//     // playerConnectedOrDisconnected(num)
// })

// On enemy ready
// socket.on('enemy-ready', num => {
//     enemyReady = true
//     playerReady(num)
//     if (ready) playGameMulti(socket)
// })

// // Check player status
// socket.on('check-players', players => {
//     players.forEach((p, i) => {
//         // if (p.connected) playerConnectedOrDisconnected(i)
//         if (p.ready) {
//             playerReady(i)
//             if (i !== playerReady) enemyReady = true
//         }
//     })
// })

// On Timeout
// socket.on('timeout', () => {
//     EnnemyText.innerHTML = 'You have reached the 10 minute limit'
// })

// Ready button click
// startButton.addEventListener('click', () => {
//     if (allShipsPlaced) playGameMulti(socket)
//     else infoDisplay.innerHTML = "Please place all ships"
// })
