// Generates five cards and returns them in an array.
openPack = function() {
	var cards = [];
	for (var i = 0; i < 5; i++) {
		var cardRarity = randomlyGenerate();
		cards.push(cardRarity);
		
		// If we are on the last card, and so far we have no rare or better, replace with new generated one.
		if (i == 4) {
			while (checkForRareOrBetter(cards) == false) { // Do this loop until we get a rare or better.
				var newRarity = randomlyGenerate(); // Randomly generate new card.
				cards.splice(i); // Remove last card from array.
				cards.push(newRarity); // Add new card.
			}
		}
	}
	return cards;
}

// Checks deck for a rare or better. Returns true if found, false if not.
checkForRareOrBetter = function(cardDeck) {
	for (var i = 0; i < cardDeck.length; i++) {
		if(cardDeck[i].value >= 2) {
			return true;
		}
	}	
	return false;
}

// Randomly generates a card based on probabilities of card types.
randomlyGenerate = function() {
	var commonProb = 70.36;
	var goldCommonProb = commonProb + 1.49;
	var rareProb = goldCommonProb + 21.6;
	var goldRareProb = rareProb + 1.27
	var epicProb = goldRareProb + 4.08;
	var goldEpicProb = epicProb + .19;
	var legendProb = goldEpicProb + .94;
	var goldLegendProb = legendProb + .07
	
	var randomNumber = Number((Math.random() * 100).toFixed(2));
	
	if(randomNumber <= commonProb) { return { name: "Common", value: 0 }}
	else if (randomNumber > commonProb && randomNumber <= goldCommonProb) { return { name: "Gold Common", value: 1 }; }
	else if (randomNumber > goldCommonProb && randomNumber <= rareProb) { return { name: "Rare", value: 2 }; }
	else if (randomNumber > rareProb && randomNumber <= goldRareProb) { return { name: "Gold Rare", value: 3 }; }
	else if (randomNumber > goldRareProb && randomNumber <= epicProb) { return { name: "Epic", value: 4 }; }
	else if (randomNumber > epicProb && randomNumber <= goldEpicProb) { return { name: "Gold Epic", value: 5 }; }
	else if (randomNumber > goldEpicProb && randomNumber <= legendProb) { return { name: "Legendary", value: 6 }; }
	else { return { name: "Gold Legendary", value: 7 }; }
}

generateLabelClass = function(card) {
	var className = ""
	if (card.value % 2 != 0) {
		className = "golden ";
	}
	switch(card.value) {
		case 0:
		case 1:
			return className + "label-common";
		case 2:
		case 3:
			return className + "label-rare";
		case 4:
		case 5:
			return className + "label-epic";
		case 6:
		case 7:
			return className + "label-legendary";
	}	
}

countTypes = function(packs, type) {
	var count = 0;
	for (var i = 0; i < packs.length; i++) {
		var pack = packs[i];
		for (var j = 0; j < pack.length; j++) {
			var card = pack[j]
			if (card.value == type) {
				count++
			}
		}
	}
	return count;
}

// This could be refactored. Lots of repeating code here. Populates the summary pane.
populateSummary = function(packs) {
	$('#summaryContainer').show();
	$('#summaryList').empty();
	
	var commonCount = countTypes(packs, 0);
	if (commonCount > 0) {
		var htmlString = "<li><h6>";
		htmlString += ("Commons: " + commonCount);
		htmlString += ("</h6></li>");
		$('#summaryList').append(htmlString);
	}
	var commonGCount = countTypes(packs, 1);
	if (commonGCount > 0) {
		htmlString = "<li><h6>";
		htmlString += ("Gold Commons: " + commonGCount);
		htmlString += ("</h6></li>");
		$('#summaryList').append(htmlString);
	}
		
	var rareCount = countTypes(packs, 2);
	if (rareCount > 0) {
		htmlString = "<li><h6>";
		htmlString += ("Rares: " + rareCount);
		htmlString += ("</h6></li>");
		$('#summaryList').append(htmlString);
	}
	
	var rareGCount = countTypes(packs, 3);
	if (rareGCount > 0) {
		htmlString = "<li><h6>";
		htmlString += ("Gold Rares: " + rareGCount);
		htmlString += ("</h6></li>");
		$('#summaryList').append(htmlString);
	}
	
	var epicCount = countTypes(packs, 4);
	if (epicCount > 0) {
		htmlString = "<li><h6>";
		htmlString += ("Epics: " + epicCount);
		htmlString += ("</h6></li>");
		$('#summaryList').append(htmlString);
	}
	
	var epicGCount = countTypes(packs, 5);
	if (epicGCount > 0) {
		htmlString = "<li><h6>";
		htmlString += ("Gold Epics: " + epicGCount);
		htmlString += ("</h6></li>");
		$('#summaryList').append(htmlString);
	}
	
	var legendCount = countTypes(packs, 6);
	if (legendCount > 0) {
		htmlString = "<li><h6>";
		htmlString += ("Legendaries: " + legendCount);
		htmlString += ("</h6></li>");
		$('#summaryList').append(htmlString);
	}
	
	var legendGCount = countTypes(packs, 7); 
	if (legendGCount > 0) {
		htmlString = "<li><h6>";
		htmlString += ("Golden Legendaries: " + legendGCount);
		htmlString += ("</h6></li>");
		$('#summaryList').append(htmlString);
	}
	
}

$(document).ready(function() {
		// Percentages are for each individual card appearing as such.
		var commonProb = 70.36;
		var goldCommonProb = 1.49
		var rareProb = 21.6;
		var goldRareProb = 1.27
		var epicProb = 4.08;
		var goldEpicProb = .19;
		var legendProb = .94;
		var goldLegendProb = .07
		
		var cardPacks = [];
		
		getPacks = function() {
			$('#validate').empty();
			
			var packsQuanity = $('#numberOfPacks').val();
			
			if (isNaN(packsQuanity) || packsQuanity.trim() == "" || packsQuanity <= 0) {
				$('#validate').html("* Please enter a valid amount.");
			}
			else {
				cardPacks.length = 0;
				$('#deckResults').empty();
				$('#summaryContainer').hide();
				for (var i = 0; i <= packsQuanity-1; i++) { 
					var newPack = openPack();
					cardPacks.push(newPack);					
					var deckHtml = '<tr><td>' + (i+1) + '</td><td><span class="label label-pill label-default ' + generateLabelClass(newPack[0]) + '">' + newPack[0].name +  '</span></td><td><span class="label label-pill label-default ' + generateLabelClass(newPack[1]) + '">' + newPack[1].name + '</span></td><td><span class="label label-pill label-default ' + generateLabelClass(newPack[2]) + '">' + newPack[2].name + '</span></td><td><span class="label label-pill label-default ' + generateLabelClass(newPack[3]) + '">' + newPack[3].name + '</span></td><td><span class="label label-pill label-default ' + generateLabelClass(newPack[4]) + '">' + newPack[4].name + '</span></td></tr>'
					$('#deckResults').append(deckHtml);
				}	
				populateSummary(cardPacks);				
			}
		}
		
		$('#btnGenerate').click(function() {
			getPacks();
			return false;			
		})
		
		$('input[type=text]').on('keydown', function(e) {
			if (e.which == 13) {
				getPacks();
				e.preventDefault();
			}
		});
		
		
})