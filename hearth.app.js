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

// This could be refactored. Lots of repeating code here. Populates the summary pane.
// refactoreed
populateSummary = function(packs) {
	$('#summaryContainer').show();
	$('#summaryList').empty();
	
	var summary  = new PackCardCounter(packs).CountTypes();
	for(var key in summary)
	{
		var htmlString = "<li><h6>";
		htmlString += (key + ": " + summary[key].count);
		htmlString += ("</h6></li>");
		$('#summaryList').append(htmlString);
	}
}

$(document).ready(function() {
		var generatorFn = function(card) {
			var a1 = new CommonRarity(card);
			var a2 = new GoldCommonRarity(card);
			var a3 = new RareRarity(card);
			var a4 = new GoldRareRarity(card);
			var a5 = new EpicRarity(card);
			var a6 = new GoldEpicRarity(card);
			var a7 = new LegendaryRarity(card);
			var a8 = new GoldLegendaryRarity(card);
			a1.SetNext(a2).SetNext(a3).SetNext(a4).SetNext(a5).SetNext(a6).SetNext(a7).SetNext(a8);
			return a1;
		}	
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
		var packs = [];
		getPacks = function() {
			$('#validate').empty();
			
			var packsQuanity = $('#numberOfPacks').val();
			var ensureRare = new AtLeastOneRare();
			if (isNaN(packsQuanity) || packsQuanity.trim() == "" || packsQuanity <= 0) {
				$('#validate').html("* Please enter a valid amount.");
			}
			else {
				packs = [];
				cardPacks.length = 0;
				$('#deckResults').empty();
				$('#summaryContainer').hide();
				for (var i = 0; i <= packsQuanity-1; i++) { 
					var pack = new Pack(generatorFn);
					ensureRare.Ensure(pack);
					packs.push(pack);

					var newPack = pack.cards;
					cardPacks.push(newPack);

					var deckHtml = '<tr><td>' + (i+1) + '</td><td><span class="label label-pill label-default ' + generateLabelClass(newPack[0]) + '">' + newPack[0].name +  '</span></td><td><span class="label label-pill label-default ' + generateLabelClass(newPack[1]) + '">' + newPack[1].name + '</span></td><td><span class="label label-pill label-default ' + generateLabelClass(newPack[2]) + '">' + newPack[2].name + '</span></td><td><span class="label label-pill label-default ' + generateLabelClass(newPack[3]) + '">' + newPack[3].name + '</span></td><td><span class="label label-pill label-default ' + generateLabelClass(newPack[4]) + '">' + newPack[4].name + '</span></td></tr>'
					$('#deckResults').append(deckHtml);
				}

				populateSummary(packs);				
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