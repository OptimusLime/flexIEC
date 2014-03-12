
var Swiper = require('swiper');
var flexforever = require('flexforever');
var Emitter = require('emitter');

module.exports = flexIEC; 

var uSwipeID = 0;

var removeChildren = function(div)
{
	//we clear out the previous occupants
	var fc = div.firstChild;

	while( fc ) {
	    div.removeChild( fc );
	    fc = div.firstChild;
	}
}

var createDiv = function(id, classes, type, inner)
{
	if(!type)
		type = 'div';

	var element = document.createElement(type);

	//set our ID
	element.id = id;
	
	element.className = classes;

	if(inner)
		element.innerHTML = inner;

	return element;
}

var createLoadingDiv = function(id, classes)
{
	var element = createDiv(id, "loading");
	
	//add class information if we have it
	if(classes)
		element.className += " " + classes;

	return element;
}


var createParentContainer = function(id, classes)
{
	var element = document.createElement('div');
	
	//set our ID
	element.id = id;
	
	element.className = "parent-cell";

	//add class information if we have it
	if(classes)
		element.className += " " + classes;


	return element;
}

var createRow = function(id, additionalClasses)
{
	return createDiv(id, "row rowOR" + (additionalClasses ? (" " + additionalClasses) : "")) ;
}

function flexIEC(divValue, reqOptions)
{
	// console.log(divValue);

	var self = this;

	//lets subdivide our div object according to function

	var container = createDiv("test", "container fullWH containerOR");
	
	var row = createRow("test", "fullWH");

	//this holds all parent info
	var parentColumn = createDiv("parent-col", "col-xs-3 fullWH colObject border");

	var parentTopRow = createDiv("p-top", "");

	var choice = createDiv("p-top-choice", "border");
	choice.innerHTML = "Parent Artifacts";

	//add the choice object to our top row (to have something to display)
	parentTopRow.appendChild(choice);

	var parentBottomRow = createDiv("p-bot", "innerObject colObject");
	var innerParent = createDiv("p-inner", "innerObject special");
	// innerParent.style.flex = 1;
	parentBottomRow.appendChild(innerParent);

	//append both top and bottom to our children
	parentColumn.appendChild(parentTopRow);
	parentColumn.appendChild(parentBottomRow);
	//add parent to the second row
	// leftParentRow.appendChild(parentColumn);
	

	var rightColumn = createDiv("evo-col", "col-auto fullWH colObject border")

	// var evoTopColumn = createDiv("p-top", "");

	// var choice = createDiv("p-top-choice", "border");
	// choice.innerHTML = "Parent Artifacts";
	var tabs = createDiv("evoTabs", "tabs row");
	
	var aRef = createDiv("", "active col-auto border", "a", "Tab 1");
	aRef.href = "#";
	tabs.appendChild(aRef);
	
	aRef = createDiv("", "col-auto border", "a", "Tab 2");
	aRef.href = "#";
	tabs.appendChild(aRef);

	aRef = createDiv("", "col-auto border", "a", "Tab 3");
	aRef.href = "#";
	tabs.appendChild(aRef);

	var evoBottom = createDiv("evo-bot", "innerObject colObject");
	var innerEvo = createDiv("evo-inner", "innerObject special");
	evoBottom.appendChild(innerEvo);

	rightColumn.appendChild(tabs);
	rightColumn.appendChild(evoBottom);

	//<div class="tabs"> <a href="#" class="active">Tab 1</a> <a href="#" style="margin:0 17px">Tab 2</a> <a href="#">Tab 3</a> </div>

	//append both children
	row.appendChild(parentColumn);
	row.appendChild(rightColumn);

	container.appendChild(row);

	//then pull in the full containers
	divValue.appendChild(container);

	self.addFlexToPage = function(divToAppend, addOptions)
	{
		var flexOptions = 
		{
			objectSize: {width: 250, height: 200, rowMargin: 4},
			// mode: 'vertical' ,
			width : 500

		};

		addOptions = addOptions || {};
		
		for(var key in addOptions)
			flexOptions[key] = addOptions[key];

		var nf = flexforever(divToAppend, flexOptions)

		nf.on('elementVisible', function(eID, eDiv)
		{
			// console.log('EVisible id: ', eID, " div: ", eDiv);
			// element.className += "grid-cell";
			eDiv.appendChild(createLoadingDiv(eID + "-loading", "fullWH"));
		});


		nf.on('elementHidden', function(eID, eDiv)
		{
			// element.className += "grid-cell";
			removeChildren(eDiv);
		});

		nf.createNewPage();
	}

	// self.addFlexToPage(parentColumn, {mode: 'vertical'});
	self.addFlexToPage(innerParent, {mode: 'vertical'});
	self.addFlexToPage(innerEvo);



	// var element = createLoadingDiv("demo", "demo");

	// console.log("E: ", element);


	//add the little bugger to the inside of the div
	// divValue.appendChild(element);

	// if(!reqOptions || !reqOptions.objectSize || !reqOptions.objectSize.width || !reqOptions.objectSize.height)
		// throw new Error("Can't use flexIEC without options or objectSize");

	//add emitter properties to this object
	Emitter(self);


	//send us back please, we've got precious events to hook into
	return self;
}
