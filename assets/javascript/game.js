/*

Here's how the app works:

When the game starts, the player will choose a character by clicking on the fighter's picture. The player will fight as that character for the rest of the game.

    The player must then defeat all of the remaining fighters. Enemies should be moved to a different area of the screen.

    The player chooses an opponent by clicking on an enemy's picture.

    Once the player selects an opponent, that enemy is moved to a defender area.

    The player will now be able to click the attack button.

        Whenever the player clicks attack, their character damages the defender. The opponent will lose HP (health points). These points are displayed at the bottom of the defender's picture.
        The opponent character will instantly counter the attack. When that happens, the player's character will lose some of their HP. These points are shown at the bottom of the player character's picture.

    The player will keep hitting the attack button in an effort to defeat their opponent.

        When the defender's HP is reduced to zero or below, remove the enemy from the defender area. The player character can now choose a new opponent.

The player wins the game by defeating all enemy characters. The player loses the game the game if their character's HP falls to zero or below.

Option 2 Game design notes
    Each character in the game has 3 attributes: Health Points, Attack Power and Counter Attack Power.

    Each time the player attacks, their character's Attack Power increases by its base Attack Power.

        For example, if the base Attack Power is 6, each attack will increase the Attack Power by 6 (12, 18, 24, 30 and so on).

    The enemy character only has Counter Attack Power.

        Unlike the player's Attack Points, Counter Attack Power never changes.

    The Health Points, Attack Power and Counter Attack Power of each character must differ.

    No characters in the game can heal or recover Health Points.

        A winning player must pick their characters wisely by first fighting an enemy with low Counter Attack Power. This will allow them to grind Attack Power and to take on enemies before they lose all of their Health Points. Healing options would mess with this dynamic.
    
    Your players should be able to win and lose the game no matter what character they choose. The challenge should come from picking the right enemies, not choosing the strongest player.

*/

$(function () {

    // Character object
    function character(name, healthPoints, attackPower, counterAttackPower, image) {

        // define this character's properties
        this.name = name;
        this.baseHealthPoints = healthPoints;
        this.healthPoints = healthPoints;
        this.baseAttackPower = attackPower;
        this.attackPower = attackPower;
        this.counterAttackPower = counterAttackPower;
        // this.listener = listener;

        // build the UI element for this character
        this.domElement = $("<div>");
        this.domElement.attr("id", this.name);
        this.domElement.attr("class", "player");
        this.domElement.html(
            '<h1>' + this.name.replace("_", " ") + '</h1>' +
            '<img src="' + image + '"/>' +
            '<h2>' + this.baseHealthPoints + '</h2>'
        );
        $("#characters").append(this.domElement);

        this.reset = function () {
            $(this.domElement).find("h2").text(this.healthPoints = this.baseHealthPoints);
            this.domElement.attr("class", "player");
            this.attackPower = this.baseAttackPower;
            $("#characters").append(this.domElement);
        }
        this.takeDamage = function (damage) {
            $(this.domElement).find("h2").text(this.healthPoints -= damage);
        }
        this.levelUp = function() {
            this.attackPower += this.baseAttackPower;
        }

        this.makeEnemy = function() {
            this.domElement.attr("class", "player enemy");
        }

        this.makeOpponent = function() {
            this.domElement.attr("class", "player opponent")
        }
    }


    var gameEnded = false;
    var roundActive = false;
    var currentPlayer = null;
    var currentOpponent = null;

    // UI references
    var playerContainer = $("#player-container");
    var enemiesContainer = $("#enemies-container");
    var opponentContainer = $("#opponent-container");
    var feedback = $("#feedback");

    var characters = {
        "Luke_Skywalker": new character("Luke_Skywalker", 100, 6, 18, "http://via.placeholder.com/150x150"),
        "Obi-Wan_Kenobi": new character("Obi-Wan_Kenobi", 120, 20, 40, "http://via.placeholder.com/150x150"),
        "Darth_Sidious": new character("Darth_Sidious", 150, 60, 8, "http://via.placeholder.com/150x150"),
        "Darth_Maul": new character("Darth_Maul", 180, 15, 30, "http://via.placeholder.com/150x150")
    };


    function selectCharacter(character) {

        // first, make sure you haven't already assigned the character as a player or opponent
        if (character === currentPlayer || character === currentOpponent) {
            return;
        }
        // if no current player is selected, select this player
        if (!currentPlayer) {
            currentPlayer = character;
            playerContainer.append(character.domElement);

            $.each(characters, function (key, character) {
                if(currentPlayer !== character) {
                    character.makeEnemy();
                    enemiesContainer.append(character.domElement);
                }
            });
        }
        // if no current opponent is selected, select this oponent
        else if (!currentOpponent) {
            currentOpponent = character;
            currentOpponent.makeOpponent();
            opponentContainer.append(character.domElement);
        }
        // otherwise, ignore input
        else {
            console.log("player & opponent are already selected");
        }

        if (currentPlayer && currentOpponent) {
            roundActive = true;
        }
    }

    function reset() {
        currentOpponent = null;
        currentPlayer = null;
        gameEnded = false;
        roundActive = true;

        $.each(characters, function (key, character) {
            character.reset();
        });
    }

    function attack() {
        if (!roundActive || gameEnded || !currentPlayer || !currentOpponent) {
            feedback.text("can't attack");
            return;
        }

        currentOpponent.takeDamage(currentPlayer.attackPower);

        if (currentOpponent.healthPoints <= 0) {
            feedback.text("You defeated! " + currentOpponent.name.replace("_", " "));
            currentOpponent.domElement.fadeOut("fast", currentOpponent.domElement.detach);
            currentOpponent = null;
            roundActive = false;
        }
        else {
            currentPlayer.takeDamage(currentOpponent.counterAttackPower);
        }

        if (currentPlayer.healthPoints <= 0) {
            feedback.text("You lost");
            $("#restart").show();
            roundActive = false;
            gameEnded = true;
        } 
        else {
            currentPlayer.levelUp();
        }


    }

    function initialize() {
        $.each(characters, function (key, character) {
            character.domElement.click(function () {
                selectCharacter(characters[this.id]);
            });
        });

        $("#attack").click(attack);
        $("#restart").click(reset);

        $("#restart").hide();
    }

    // calls
    initialize();

});

