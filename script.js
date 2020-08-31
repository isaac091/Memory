var num_pairs = 18;
var cardImgs = new Array(num_pairs * 2).fill("");
var flipped = new Array(num_pairs * 2).fill(false);
var matched = new Array(num_pairs * 2).fill(false);
var lastTwo = [-1, -1];
var check = false;
var score = 0;

// Gets JSON object from API, randomizes card order, places cards
function setup() {
    getCardData();

    score = 0;
    document.getElementById("score").innerHTML = "Score: " + score;

    for (var k = 0; k < num_pairs * 2; k++) {
        var new_card = document.createElement('img');

        new_card.id = k;
        new_card.classList.add("card");
        new_card.src = "red_back.png";
        new_card.setAttribute("onclick", "clicked(" + k + ");");
        new_card.setAttribute("onmouseover", "hover(" + k + ");");
        new_card.setAttribute("onmouseout", "unhover(" + k + ");");

        document.getElementById('grid').appendChild(new_card);
    }
}

function reset() {
    getCardData();

    flipped = new Array(num_pairs * 2).fill(false);
    check = false;
    lastTwo = [-1, -1];
    score = 0;
    document.getElementById("score").innerHTML = "Score: " + score;

    for (var i = 0; i < num_pairs * 2; i++) {
        document.getElementById(i).src = "red_back.png";
    }
}

function getCardData() {
    var request = new XMLHttpRequest();
    request.open('GET', 'https://deckofcardsapi.com/api/deck/new/draw/?count=' + num_pairs, true);
    request.onload = function() {
        var deck = JSON.parse(this.response);

        cardImgs.fill("");

        // Put each card in the game twice randomly
        for (var i = 0; i < num_pairs; i++) {
            var placed = 0;

            while (placed < 2) {
                var j = Math.floor(Math.random() * num_pairs * 2);

                if (cardImgs[j] == "") {
                    cardImgs[j] = deck.cards[i].image;
                    placed++;
                }
            }
        }
    }

    request.send();
}

// Flips card over, if two cards are up, check to see if they match
function clicked(id) {
    if (flipped[id] || matched[id]) {
        return;
    }

    document.getElementById(id).src = cardImgs[id];
    flipped[id] = true;

    if (check) {
        // Change last index to id, if two id's match, stay up, else flip down
        lastTwo[1] = id;

        if (cardImgs[lastTwo[0]] == cardImgs[lastTwo[1]]) {
            updateMatches();

            if (score == num_pairs) {
                alert("you win");
            }
        } else {
            reflipPair();
        }
    } else {
        lastTwo[0] = id;
    }

    check = !check;

    // Checks for flipped up cards that shouldn't be
    for (var i = 0; i < num_pairs * 2; i++) {
        if (flipped[i] && !lastTwo.includes(i)) {
            document.getElementById(i).src = "red_back.png";
            flipped[i] = false;

            check = !check;

            break;
        }
    }
}

// Delays the code from executing
function sleep(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
}

// Reset nonmatching pair
async function reflipPair() {
    await sleep(300);

    document.getElementById(lastTwo[0]).src = "red_back.png";
    document.getElementById(lastTwo[1]).src = "red_back.png";  
    
    flipped[lastTwo[0]] = false;
    flipped[lastTwo[1]] = false;
}

// Change matched cards to matched state
function updateMatches() {
    score++;

    document.getElementById('score').innerHTML = "Score: " + score;

    flipped[lastTwo[0]] = false;
    flipped[lastTwo[1]] = false;

    matched[lastTwo[0]] = true;
    matched[lastTwo[1]] = true;
}

// Apply animation to card being hovered over
function hover(id) {
    var src = document.getElementById(id).src;
    if (src.includes('red_back.png')) {
        document.getElementById(id).style.transform = "scale(1.03,1.03)";
        document.getElementById(id).style.cursor = "pointer";
    } else {
        document.getElementById(id).style.cursor = "default";
    }
}

// Reset hover animation
function unhover(id) {
    document.getElementById(id).style.transform = "rotate(0deg)";
}