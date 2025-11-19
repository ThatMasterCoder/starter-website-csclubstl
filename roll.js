

var rollsSince = parseInt(localStorage.getItem("rollsSince")) || 0;
// Load roll history from localStorage
var rollHistory = JSON.parse(localStorage.getItem("rollHistory")) || [];
let lastRareRoll = 0;

const items = {
        "Necron's Handle": 0.109,
        "Implosion": 0.145,
        "Shadow Warp": 0.145,
        "Wither Shield": 0.145,
        "Auto Recombobulator": 0.583,
        "Wither Chestplate": 0.583,
        "One for All I": 0.583,
        "Wither Leggings": 2.334,
        "Recombobulator 3000": 2.918,
        "Wither Cloak Sword": 3.502,
        "Soul Eater I": 5.836,
        "Fuming Potato Book": 2.918
};
const rare = ["Necron's Handle",
    "Implosion",
    "Shadow Warp",
    "Wither Shield"
];
function rollItems(){
    let rolled_items = [];
    for (var item in items){
        var chance = items[item]*0.01;
        var roll = Math.random();
        if (roll <= chance){
            rolled_items.push(item);
        }
    }
    if (rolled_items.length == 0){
        let garbage = ["Infinite Quiver VI", "Hot Potato Book", "Feather Falling VI", "Combo I", "Ultimate Jerry II", "Ultimate Wise I"];
        return garbage [Math.floor(Math.random() * garbage.length)];
    }
    rolled_items.sort((a, b)=> {return items[a] - items[b]});
    return rolled_items;
}

// bedrock chest only
function rollf7(getThisItem){

    let rolled_item;
    if (getThisItem){
        rolled_item = getThisItem;
        if (!Object.keys(items).includes(rolled_item)){
            console.log("Invalid Item");
            return;
        }
    } else {
        rolled_item = rollItems();
    }
    rollsSince++; // Increment every roll
    
    // Check if the rolled item is a rare (handle both string and array returns)
    let isRareItem = false;
    if (Array.isArray(rolled_item)) {
        isRareItem = rolled_item.some(item => isRare(item));
    } else {
        isRareItem = isRare(rolled_item);
    }

    if (isRareItem) {
        console.log("You got a Handle/Scroll!");
        console.log("Rolls since last Handle/Scroll: " + rollsSince);
        console.log(rolled_item);
        lastRareRoll = rollsSince;
        rollsSince = 0; // Reset when you get a rare
    }

    localStorage.setItem("rollsSince", rollsSince);

    return rolled_item;
}

function isRare(item) {
    return rare.includes(item);
}

// Function called by the button on the webpage
function rollSkyblock(getThisItem){
    const result = rollf7(getThisItem);

    if (result == undefined){
        return;
    }
    // Display the result
    let resultText = Array.isArray(result) ? result.join(', ') : result;
    document.getElementById('result').textContent = 'You got: ' + resultText;
    
    // Add to roll history (keep last 5)
    rollHistory.unshift(resultText); // Add to beginning
    if (rollHistory.length > 5) {
        rollHistory.pop(); // Remove oldest
    }
    localStorage.setItem("rollHistory", JSON.stringify(rollHistory));
    
    // Display roll history as list items
    let historyList = document.getElementById('rollHistory');
    historyList.innerHTML = ''; // Clear existing items
    
    rollHistory.forEach(roll => {
        let li = document.createElement('li');
        if (isRare(roll)){
            roll = "<b>" + roll + " (RARE!) took " + lastRareRoll + " rolls since last Handle/Scroll</b>";
        }
        li.innerHTML = roll;
        historyList.appendChild(li);
    });
    
    // Display rolls since last rare
    document.getElementById('rollsSince').textContent = 'Rolls since last Handle/Scroll: ' + rollsSince;

    if (Array.isArray(result)) {
        resultText = result.join(', ');
        for (let i = 0; i < result.length; i++) {
            if (isRare(result[i])) {
                resultText += " (RARE!) took " + rollsSince + " rolls since last Handle/Scroll";
            }
        }
    }
    return resultText;
}




function rollMany(n){
    for (let i = 0; i < n; i++){
        console.log(rollSkyblock());
    }
}

// For testing in Node.js (console)
function main(){
    console.log(rollf7());
    console.log("Rolls since last rare: " + rollsSince);
}

// Only run main() if we're in Node.js environment (not in browser)
if (typeof window === 'undefined') {
    main();
}